<?php

class User
{
    public static function findById(int $id): ?array
    {
        $db = Database::connect();
        $stmt = $db->prepare('SELECT id, name, email, role, is_verified, created_at FROM users WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function findByEmail(string $email): ?array
    {
        $db = Database::connect();
        $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }

    public static function findByVerificationToken(string $token): ?array
    {
        $db = Database::connect();
        $stmt = $db->prepare(
            'SELECT * FROM users WHERE verification_token = ? AND verification_expires > NOW()'
        );
        $stmt->execute([$token]);
        return $stmt->fetch() ?: null;
    }

    public static function findByResetToken(string $token): ?array
    {
        $db = Database::connect();
        $stmt = $db->prepare(
            'SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()'
        );
        $stmt->execute([$token]);
        return $stmt->fetch() ?: null;
    }

    public static function create(string $name, string $email, string $passwordHash, string $verificationToken): int
    {
        $db = Database::connect();
        $expires = date('Y-m-d H:i:s', strtotime('+' . VERIFICATION_TOKEN_EXPIRY . ' hours'));
        $stmt = $db->prepare(
            'INSERT INTO users (name, email, password_hash, verification_token, verification_expires) VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([$name, $email, $passwordHash, $verificationToken, $expires]);
        return (int)$db->lastInsertId();
    }

    public static function verify(int $id): void
    {
        $db = Database::connect();
        $stmt = $db->prepare(
            'UPDATE users SET is_verified = 1, verification_token = NULL, verification_expires = NULL WHERE id = ?'
        );
        $stmt->execute([$id]);
    }

    public static function updateName(int $id, string $name): void
    {
        $db = Database::connect();
        $stmt = $db->prepare('UPDATE users SET name = ? WHERE id = ?');
        $stmt->execute([$name, $id]);
    }

    public static function setResetToken(int $id, string $token): void
    {
        $db = Database::connect();
        $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));
        $stmt = $db->prepare('UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?');
        $stmt->execute([$token, $expires, $id]);
    }

    public static function resetPassword(int $id, string $passwordHash): void
    {
        $db = Database::connect();
        $stmt = $db->prepare(
            'UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?'
        );
        $stmt->execute([$passwordHash, $id]);
    }

    public static function count(): int
    {
        $db = Database::connect();
        return (int)$db->query('SELECT COUNT(*) FROM users')->fetchColumn();
    }
}
