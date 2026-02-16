<?php

class Newsletter
{
    public static function subscribe(string $email, string $frequency = 'weekly'): array
    {
        $db = Database::connect();

        // Check if already subscribed
        $stmt = $db->prepare('SELECT * FROM newsletter_subscribers WHERE email = ?');
        $stmt->execute([$email]);
        $existing = $stmt->fetch();

        if ($existing) {
            if ($existing['is_verified']) {
                return ['already_subscribed' => true];
            }
            return ['token' => $existing['token'], 'already_exists' => true];
        }

        $token = Validator::generateToken();
        $unsubToken = Validator::generateToken();

        $stmt = $db->prepare(
            'INSERT INTO newsletter_subscribers (email, frequency, token, unsubscribe_token) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$email, $frequency, $token, $unsubToken]);

        return ['token' => $token, 'id' => (int)$db->lastInsertId()];
    }

    public static function verify(string $token): bool
    {
        $db = Database::connect();
        $stmt = $db->prepare('UPDATE newsletter_subscribers SET is_verified = 1 WHERE token = ? AND is_verified = 0');
        $stmt->execute([$token]);
        return $stmt->rowCount() > 0;
    }

    public static function unsubscribe(string $token): bool
    {
        $db = Database::connect();
        $stmt = $db->prepare('DELETE FROM newsletter_subscribers WHERE unsubscribe_token = ?');
        $stmt->execute([$token]);
        return $stmt->rowCount() > 0;
    }

    public static function getAllPaginated(int $page, int $limit): array
    {
        $db = Database::connect();
        $offset = ($page - 1) * $limit;

        $total = (int)$db->query('SELECT COUNT(*) FROM newsletter_subscribers')->fetchColumn();

        $stmt = $db->prepare(
            'SELECT id, email, frequency, is_verified, created_at
             FROM newsletter_subscribers
             ORDER BY created_at DESC
             LIMIT ? OFFSET ?'
        );
        $stmt->execute([$limit, $offset]);

        return ['data' => $stmt->fetchAll(), 'total' => $total];
    }

    public static function getAllVerified(): array
    {
        $db = Database::connect();
        return $db->query(
            'SELECT email, frequency FROM newsletter_subscribers WHERE is_verified = 1'
        )->fetchAll();
    }

    public static function delete(int $id): void
    {
        $db = Database::connect();
        $db->prepare('DELETE FROM newsletter_subscribers WHERE id = ?')->execute([$id]);
    }

    public static function count(): int
    {
        $db = Database::connect();
        return (int)$db->query('SELECT COUNT(*) FROM newsletter_subscribers')->fetchColumn();
    }
}
