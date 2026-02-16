<?php

class Comment
{
    public static function getByResource(int $resourceId): array
    {
        $db = Database::connect();
        $stmt = $db->prepare(
            'SELECT c.*, u.name as user_name
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.resource_id = ? AND c.is_approved = 1
             ORDER BY c.created_at ASC'
        );
        $stmt->execute([$resourceId]);
        $comments = $stmt->fetchAll();

        return self::buildTree($comments);
    }

    private static function buildTree(array $comments, ?int $parentId = null): array
    {
        $tree = [];
        foreach ($comments as $comment) {
            if ($comment['parent_id'] == $parentId) {
                $comment['replies'] = self::buildTree($comments, (int)$comment['id']);
                $tree[] = $comment;
            }
        }
        return $tree;
    }

    public static function create(int $userId, int $resourceId, string $comment, ?int $parentId = null): int
    {
        $db = Database::connect();
        $stmt = $db->prepare(
            'INSERT INTO comments (user_id, resource_id, parent_id, comment) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$userId, $resourceId, $parentId, $comment]);
        return (int)$db->lastInsertId();
    }

    public static function findById(int $id): ?array
    {
        $db = Database::connect();
        $stmt = $db->prepare('SELECT * FROM comments WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function delete(int $id): void
    {
        $db = Database::connect();
        $db->prepare('DELETE FROM comments WHERE id = ?')->execute([$id]);
    }

    public static function approve(int $id): void
    {
        $db = Database::connect();
        $db->prepare('UPDATE comments SET is_approved = 1 WHERE id = ?')->execute([$id]);
    }

    public static function getAllPaginated(int $page, int $limit): array
    {
        $db = Database::connect();
        $offset = ($page - 1) * $limit;

        $total = (int)$db->query('SELECT COUNT(*) FROM comments')->fetchColumn();

        $stmt = $db->prepare(
            'SELECT c.*, u.name as user_name, r.title as resource_title
             FROM comments c
             JOIN users u ON c.user_id = u.id
             JOIN resources r ON c.resource_id = r.id
             ORDER BY c.created_at DESC
             LIMIT ? OFFSET ?'
        );
        $stmt->execute([$limit, $offset]);

        return ['data' => $stmt->fetchAll(), 'total' => $total];
    }

    public static function count(): int
    {
        $db = Database::connect();
        return (int)$db->query('SELECT COUNT(*) FROM comments')->fetchColumn();
    }
}
