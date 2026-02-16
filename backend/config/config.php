<?php

// Load environment variables from .env file if it exists
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (strpos($line, '=') === false) continue;
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, " \t\n\r\0\x0B\"'");
        putenv("$key=$value");
        $_ENV[$key] = $value;
    }
}

// Application settings
define('APP_NAME', 'Haxcode Technology Solutions');
define('APP_URL', getenv('APP_URL') ?: 'http://localhost');
define('FRONTEND_URL', getenv('FRONTEND_URL') ?: 'http://localhost:5173');
define('API_VERSION', 'v1');

// JWT settings
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'change-this-to-a-long-random-string');
define('JWT_EXPIRY', 86400 * 7); // 7 days

// SMTP settings (Hostinger)
define('SMTP_HOST', getenv('SMTP_HOST') ?: 'smtp.hostinger.com');
define('SMTP_PORT', (int)(getenv('SMTP_PORT') ?: 465));
define('SMTP_USER', getenv('SMTP_USER') ?: '');
define('SMTP_PASS', getenv('SMTP_PASS') ?: '');
define('SMTP_FROM_EMAIL', getenv('SMTP_FROM_EMAIL') ?: 'noreply@haxcode.com');
define('SMTP_FROM_NAME', getenv('SMTP_FROM_NAME') ?: APP_NAME);
define('SMTP_ENCRYPTION', getenv('SMTP_ENCRYPTION') ?: 'ssl');

// FMHY settings
define('FMHY_API_URL', getenv('FMHY_API_URL') ?: 'https://api.fmhy.net');

// Rate limiting
define('RATE_LIMIT_WINDOW', 900); // 15 minutes
define('RATE_LIMIT_MAX_REQUESTS', 100);

// Pagination
define('DEFAULT_PAGE_SIZE', 20);
define('MAX_PAGE_SIZE', 100);

// Email verification token expiry (hours)
define('VERIFICATION_TOKEN_EXPIRY', 48);
