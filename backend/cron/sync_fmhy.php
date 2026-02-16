<?php

/**
 * FMHY Data Sync Cron Job
 *
 * Add to crontab on shared hosting:
 * 0 */6 * * * /usr/bin/php /path/to/api/cron/sync_fmhy.php >> /path/to/logs/fmhy_sync.log 2>&1
 *
 * Runs every 6 hours to sync data from FMHY.
 */

declare(strict_types=1);

// Only allow CLI execution
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('CLI only');
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/Response.php';
require_once __DIR__ . '/../helpers/Validator.php';
require_once __DIR__ . '/../models/Resource.php';
require_once __DIR__ . '/../models/Category.php';

echo "[" . date('Y-m-d H:i:s') . "] Starting FMHY sync...\n";

$db = Database::connect();

// Log sync start
$stmt = $db->prepare("INSERT INTO fmhy_sync_log (sync_type, status) VALUES ('cron', 'started')");
$stmt->execute();
$syncId = (int)$db->lastInsertId();

try {
    $context = stream_context_create([
        'http' => [
            'timeout' => 60,
            'header' => "Accept: application/json\r\nUser-Agent: HaxcodeFMHY/1.0\r\n",
        ],
    ]);

    $response = @file_get_contents(FMHY_API_URL . '/resources', false, $context);

    if ($response === false) {
        throw new \Exception('Failed to connect to FMHY API');
    }

    $data = json_decode($response, true);
    $resources = $data['data'] ?? $data ?? [];
    $synced = 0;

    foreach ($resources as $item) {
        $title = $item['title'] ?? $item['name'] ?? '';
        if (empty($title)) continue;

        $slug = Validator::slugify($title);
        $fmhyId = $item['id'] ?? $slug;

        $checkStmt = $db->prepare('SELECT id FROM resources WHERE fmhy_source_id = ?');
        $checkStmt->execute([$fmhyId]);

        if ($checkStmt->fetch()) {
            $updateStmt = $db->prepare(
                'UPDATE resources SET title = ?, description = ?, tags = ?, updated_at = NOW() WHERE fmhy_source_id = ?'
            );
            $updateStmt->execute([
                $title,
                $item['description'] ?? '',
                is_array($item['tags'] ?? null) ? implode(',', $item['tags']) : ($item['tags'] ?? ''),
                $fmhyId,
            ]);
        } else {
            Resource::create([
                'title' => $title,
                'description' => $item['description'] ?? $title,
                'url' => $item['url'] ?? null,
                'category' => $item['category'] ?? 'Miscellaneous',
                'tags' => is_array($item['tags'] ?? null) ? implode(',', $item['tags']) : ($item['tags'] ?? ''),
                'is_free' => 1,
                'popularity_score' => $item['popularity'] ?? 0,
            ]);
        }

        $synced++;
    }

    $stmt = $db->prepare(
        "UPDATE fmhy_sync_log SET status = 'completed', records_synced = ?, completed_at = NOW() WHERE id = ?"
    );
    $stmt->execute([$synced, $syncId]);

    echo "[" . date('Y-m-d H:i:s') . "] Sync completed: $synced resources processed\n";
} catch (\Exception $e) {
    $stmt = $db->prepare(
        "UPDATE fmhy_sync_log SET status = 'failed', error_message = ?, completed_at = NOW() WHERE id = ?"
    );
    $stmt->execute([$e->getMessage(), $syncId]);

    echo "[" . date('Y-m-d H:i:s') . "] Sync failed: " . $e->getMessage() . "\n";
    exit(1);
}
