<?php

class Auth
{
    private static ?array $currentUser = null;

    public static function requireAuth(): bool
    {
        $user = self::getUser();
        if (!$user) {
            Response::error('Authentication required', 401);
            return false;
        }
        return true;
    }

    public static function requireAdmin(): bool
    {
        $user = self::getUser();
        if (!$user) {
            Response::error('Authentication required', 401);
            return false;
        }
        if ($user['role'] !== 'admin') {
            Response::error('Admin access required', 403);
            return false;
        }
        return true;
    }

    public static function getUser(): ?array
    {
        if (self::$currentUser !== null) {
            return self::$currentUser;
        }

        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!str_starts_with($header, 'Bearer ')) {
            return null;
        }

        $token = substr($header, 7);
        $payload = JWT::decode($token);
        if (!$payload || !isset($payload['user_id'])) {
            return null;
        }

        $user = User::findById($payload['user_id']);
        if (!$user || !$user['is_verified']) {
            return null;
        }

        self::$currentUser = $user;
        return $user;
    }

    public static function getUserId(): ?int
    {
        $user = self::getUser();
        return $user ? (int)$user['id'] : null;
    }
}
