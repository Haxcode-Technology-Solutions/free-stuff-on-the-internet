<?php

class Bookmark
{
    public static function getByUser(int $userId): array
    {
        $db = Database::connect();
        $stmt = $db->prepare(
            'SELECT r.*, c.name as category_name, c.slug as category_slug
             FROM bookmarks b
             JOIN resources r ON b.resource_id = r.id
             LEFT JOIN categories c ON r.category_id = c.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC'
        );
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public static function exists(int $userId, int $resourceId): bool
    {
        $db = Database::connect();
        $stmt = $db->prepare('SELECT COUNT(*) FROM bookmarks WHERE user_id = ? AND resource_id = ?');
        $stmt->execute([$userId, $resourceId]);
        return $stmt->fetchColumn() > 0;
    }

    public static function toggle(int $userId, int $resourceId): bool
    {
        if (self::exists($userId, $resourceId)) {
            self::remove($userId, $resourceId);
            return false;
        }
        self::add($userId, $resourceId);
        return true;
    }

    public static function add(int $userId, int $resourceId): void
    {
        $db = Database::connect();
        $stmt = $db->prepare('INSERT IGNORE INTO bookmarks (user_id, resource_id) VALUES (?, ?)');
        $stmt->execute([$userId, $resourceId]);
    }

    public static function remove(int $userId, int $resourceId): void
    {
        $db = Database::connect();
        $stmt = $db->prepare('DELETE FROM bookmarks WHERE user_id = ? AND resource_id = ?');
        $stmt->execute([$userId, $resourceId]);
    }
}
