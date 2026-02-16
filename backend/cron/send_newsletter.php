<?php

/**
 * Newsletter Send Cron Job
 *
 * Crontab entries:
 * Daily:    0 8 * * * /usr/bin/php /path/to/api/cron/send_newsletter.php daily
 * Weekly:   0 8 * * 1 /usr/bin/php /path/to/api/cron/send_newsletter.php weekly
 * Trending: 0 8 * * 3,6 /usr/bin/php /path/to/api/cron/send_newsletter.php trending
 */

declare(strict_types=1);

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('CLI only');
}

$frequency = $argv[1] ?? 'weekly';
if (!in_array($frequency, ['daily', 'weekly', 'trending'])) {
    echo "Usage: php send_newsletter.php [daily|weekly|trending]\n";
    exit(1);
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/Validator.php';
require_once __DIR__ . '/../helpers/Mailer.php';
require_once __DIR__ . '/../models/Newsletter.php';
require_once __DIR__ . '/../models/Resource.php';

echo "[" . date('Y-m-d H:i:s') . "] Sending $frequency newsletter...\n";

$db = Database::connect();

// Get subscribers for this frequency
$stmt = $db->prepare(
    'SELECT email, unsubscribe_token FROM newsletter_subscribers WHERE frequency = ? AND is_verified = 1'
);
$stmt->execute([$frequency]);
$subscribers = $stmt->fetchAll();

if (empty($subscribers)) {
    echo "No subscribers for $frequency frequency.\n";
    exit(0);
}

// Get resources based on frequency
$sort = $frequency === 'trending' ? 'views' : 'newest';
$days = $frequency === 'daily' ? 1 : 7;

$stmt = $db->prepare(
    "SELECT title, slug, description, category FROM resources
     WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)
     ORDER BY " . ($sort === 'views' ? 'view_count DESC' : 'created_at DESC') . "
     LIMIT 10"
);
$stmt->execute([$days]);
$resources = $stmt->fetchAll();

if (empty($resources)) {
    echo "No new resources to send.\n";
    exit(0);
}

// Build email content
$resourcesHtml = '';
foreach ($resources as $r) {
    $link = FRONTEND_URL . '/resource/' . $r['slug'];
    $desc = mb_substr($r['description'], 0, 100) . '...';
    $resourcesHtml .= <<<HTML
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #1e1e2e;">
        <a href="$link" style="color:#00ff88;text-decoration:none;font-weight:600;">{$r['title']}</a>
        <br><span style="color:#9ca3af;font-size:12px;">{$r['category']} &middot; $desc</span>
      </td>
    </tr>
    HTML;
}

$sent = 0;
foreach ($subscribers as $sub) {
    $unsubLink = FRONTEND_URL . "/newsletter/unsubscribe?token={$sub['unsubscribe_token']}";

    $html = <<<HTML
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:#111118;border:1px solid #1e1e2e;border-radius:12px;">
        <div style="padding:24px;text-align:center;background:linear-gradient(135deg,rgba(0,255,136,0.05),rgba(99,102,241,0.05));border-radius:12px 12px 0 0;">
          <h1 style="color:#00ff88;font-size:20px;margin:0;">Your $frequency Resource Digest</h1>
          <p style="color:#9ca3af;font-size:13px;margin:8px 0 0;">Curated by Haxcode Technology Solutions</p>
        </div>
        <div style="padding:24px;">
          <table style="width:100%;border-collapse:collapse;">$resourcesHtml</table>
          <div style="text-align:center;margin:24px 0 0;">
            <a href="$unsubLink" style="color:#6b7280;font-size:11px;">Unsubscribe</a>
          </div>
        </div>
      </div>
    </body>
    </html>
    HTML;

    $subject = ucfirst($frequency) . ' Resource Digest - ' . APP_NAME;
    if (Mailer::send($sub['email'], $subject, $html)) {
        $sent++;
    }

    // Throttle to avoid SMTP limits
    usleep(200000); // 200ms between emails
}

echo "[" . date('Y-m-d H:i:s') . "] Sent $sent/$sent newsletters for $frequency\n";
