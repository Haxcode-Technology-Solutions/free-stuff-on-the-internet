<?php

class Resource
{
    public static function getAll(array $params = []): array
    {
        $db = Database::connect();
        $page = (int)($params['page'] ?? 1);
        $limit = min((int)($params['limit'] ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
        $offset = ($page - 1) * $limit;
        $sort = $params['sort'] ?? 'popular';
        $category = $params['category'] ?? null;
        $price = $params['price'] ?? null;
        $tags = $params['tags'] ?? null;

        $where = [];
        $bindings = [];

        if ($category) {
            $where[] = '(r.category = ? OR c.slug = ?)';
            $bindings[] = $category;
            $bindings[] = $category;
        }

        if ($price === 'free') {
            $where[] = 'r.is_free = 1';
        } elseif ($price === 'paid') {
            $where[] = 'r.is_free = 0';
        }

        if ($tags) {
            $tagList = array_map('trim', explode(',', $tags));
            $tagConditions = [];
            foreach ($tagList as $tag) {
                $tagConditions[] = 'r.tags LIKE ?';
                $bindings[] = "%$tag%";
            }
            $where[] = '(' . implode(' OR ', $tagConditions) . ')';
        }

        $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

        $orderBy = match ($sort) {
            'newest' => 'r.created_at DESC',
            'alpha' => 'r.title ASC',
            'views' => 'r.view_count DESC',
            'updated' => 'r.updated_at DESC',
            'trending' => 'r.view_count DESC, r.created_at DESC',
            default => 'r.popularity_score DESC',
        };

        // Count total
        $countSql = "SELECT COUNT(*) FROM resources r LEFT JOIN categories c ON r.category_id = c.id $whereClause";
        $stmt = $db->prepare($countSql);
        $stmt->execute($bindings);
        $total = (int)$stmt->fetchColumn();

        // Fetch results
        $sql = "SELECT r.*, c.name as category_name, c.slug as category_slug
                FROM resources r
                LEFT JOIN categories c ON r.category_id = c.id
                $whereClause
                ORDER BY $orderBy
                LIMIT ? OFFSET ?";
        $allBindings = array_merge($bindings, [$limit, $offset]);
        $stmt = $db->prepare($sql);
        $stmt->execute($allBindings);
        $resources = $stmt->fetchAll();

        return ['data' => $resources, 'total' => $total, 'page' => $page, 'limit' => $limit];
    }

    public static function search(string $query, array $params = []): array
    {
        $db = Database::connect();
        $page = (int)($params['page'] ?? 1);
        $limit = min((int)($params['limit'] ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
        $offset = ($page - 1) * $limit;

        // Count
        $stmt = $db->prepare(
            'SELECT COUNT(*) FROM resources WHERE MATCH(title, description, tags) AGAINST(? IN BOOLEAN MODE)'
        );
        $stmt->execute([$query . '*']);
        $total = (int)$stmt->fetchColumn();

        // Search with relevance
        $stmt = $db->prepare(
            'SELECT r.*, c.name as category_name, c.slug as category_slug,
                    MATCH(r.title, r.description, r.tags) AGAINST(? IN BOOLEAN MODE) as relevance
             FROM resources r
             LEFT JOIN categories c ON r.category_id = c.id
             WHERE MATCH(r.title, r.description, r.tags) AGAINST(? IN BOOLEAN MODE)
             ORDER BY relevance DESC, r.popularity_score DESC
             LIMIT ? OFFSET ?'
        );
        $stmt->execute([$query . '*', $query . '*', $limit, $offset]);
        $resources = $stmt->fetchAll();

        return ['data' => $resources, 'total' => $total, 'page' => $page, 'limit' => $limit];
    }

    public static function findBySlug(string $slug): ?array
    {
        $db = Database::connect();
        $stmt = $db->prepare(
            'SELECT r.*, c.name as category_name, c.slug as category_slug
             FROM resources r
             LEFT JOIN categories c ON r.category_id = c.id
             WHERE r.slug = ?'
        );
        $stmt->execute([$slug]);
        $resource = $stmt->fetch();

        if ($resource) {
            // Increment view count
            $db->prepare('UPDATE resources SET view_count = view_count + 1 WHERE id = ?')
               ->execute([$resource['id']]);
        }

        return $resource ?: null;
    }

    public static function getRelated(string $slug, int $limit = 5): array
    {
        $db = Database::connect();
        $stmt = $db->prepare(
            'SELECT r2.* FROM resources r1
             JOIN resources r2 ON r2.category_id = r1.category_id AND r2.slug != r1.slug
             WHERE r1.slug = ?
             ORDER BY r2.popularity_score DESC
             LIMIT ?'
        );
        $stmt->execute([$slug, $limit]);
        return $stmt->fetchAll();
    }

    public static function create(array $data): int
    {
        $db = Database::connect();
        $slug = Validator::slugify($data['title']);

        // Ensure unique slug
        $stmt = $db->prepare('SELECT COUNT(*) FROM resources WHERE slug = ?');
        $stmt->execute([$slug]);
        if ($stmt->fetchColumn() > 0) {
            $slug .= '-' . substr(md5(uniqid()), 0, 6);
        }

        $stmt = $db->prepare(
            'INSERT INTO resources (title, slug, description, url, category_id, category, tags, is_free, popularity_score)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['title'],
            $slug,
            $data['description'],
            $data['url'] ?? null,
            $data['category_id'] ?? null,
            $data['category'] ?? null,
            $data['tags'] ?? null,
            $data['is_free'] ?? 1,
            $data['popularity_score'] ?? 0,
        ]);
        return (int)$db->lastInsertId();
    }

    public static function update(int $id, array $data): void
    {
        $db = Database::connect();
        $fields = [];
        $values = [];

        $allowed = ['title', 'description', 'url', 'category_id', 'category', 'tags', 'is_free', 'popularity_score'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }

        if (empty($fields)) return;

        $values[] = $id;
        $sql = 'UPDATE resources SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $db->prepare($sql)->execute($values);
    }

    public static function delete(int $id): void
    {
        $db = Database::connect();
        $db->prepare('DELETE FROM resources WHERE id = ?')->execute([$id]);
    }

    public static function count(): int
    {
        $db = Database::connect();
        return (int)$db->query('SELECT COUNT(*) FROM resources')->fetchColumn();
    }

    public static function getAllSlugs(): array
    {
        $db = Database::connect();
        return $db->query('SELECT slug, updated_at FROM resources ORDER BY updated_at DESC')->fetchAll();
    }
}
