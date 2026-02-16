<?php

class RateLimit
{
    public static function check(): bool
    {
        $ip = self::getIp();
        $endpoint = $_SERVER['REQUEST_URI'];
        $db = Database::connect();

        // Clean up old entries
        $stmt = $db->prepare('DELETE FROM rate_limits WHERE window_start < DATE_SUB(NOW(), INTERVAL ? SECOND)');
        $stmt->execute([RATE_LIMIT_WINDOW]);

        // Check current count
        $stmt = $db->prepare(
            'SELECT request_count FROM rate_limits WHERE ip_address = ? AND endpoint = ? AND window_start > DATE_SUB(NOW(), INTERVAL ? SECOND)'
        );
        $stmt->execute([$ip, $endpoint, RATE_LIMIT_WINDOW]);
        $row = $stmt->fetch();

        if ($row && $row['request_count'] >= RATE_LIMIT_MAX_REQUESTS) {
            Response::error('Too many requests. Please try again later.', 429);
            return false;
        }

        // Increment or insert
        if ($row) {
            $stmt = $db->prepare(
                'UPDATE rate_limits SET request_count = request_count + 1 WHERE ip_address = ? AND endpoint = ?'
            );
            $stmt->execute([$ip, $endpoint]);
        } else {
            $stmt = $db->prepare(
                'INSERT INTO rate_limits (ip_address, endpoint, request_count) VALUES (?, ?, 1)'
            );
            $stmt->execute([$ip, $endpoint]);
        }

        return true;
    }

    private static function getIp(): string
    {
        $headers = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
        foreach ($headers as $header) {
            if (!empty($_SERVER[$header])) {
                $ips = explode(',', $_SERVER[$header]);
                return trim($ips[0]);
            }
        }
        return '0.0.0.0';
    }
}
