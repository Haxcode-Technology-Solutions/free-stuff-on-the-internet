<?php

class Category
{
    public static function getAll(): array
    {
        $db = Database::connect();
        $stmt = $db->query(
            'SELECT c.*, COUNT(r.id) as resource_count
             FROM categories c
             LEFT JOIN resources r ON r.category_id = c.id
             GROUP BY c.id
             ORDER BY c.sort_order ASC'
        );
        return $stmt->fetchAll();
    }

    public static function findBySlug(string $slug): ?array
    {
        $db = Database::connect();
        $stmt = $db->prepare('SELECT * FROM categories WHERE slug = ?');
        $stmt->execute([$slug]);
        return $stmt->fetch() ?: null;
    }

    public static function getResources(string $slug, array $params = []): array
    {
        $params['category'] = $slug;
        return Resource::getAll($params);
    }
}
