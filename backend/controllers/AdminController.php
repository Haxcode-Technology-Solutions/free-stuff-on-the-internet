<?php

class AdminController
{
    public static function stats(array $params): void
    {
        Response::success([
            'resources' => Resource::count(),
            'comments' => Comment::count(),
            'subscribers' => Newsletter::count(),
            'users' => User::count(),
        ]);
    }

    public static function createResource(array $params): void
    {
        $data = Validator::getBody();
        $data = Validator::sanitizeArray($data, ['title', 'description', 'category', 'tags']);

        $errors = Validator::required($data, ['title', 'description']);
        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        // Resolve category_id from category name
        if (!empty($data['category'])) {
            $categories = Category::getAll();
            foreach ($categories as $cat) {
                if (strtolower($cat['name']) === strtolower($data['category']) || $cat['slug'] === $data['category']) {
                    $data['category_id'] = $cat['id'];
                    $data['category'] = $cat['name'];
                    break;
                }
            }
        }

        $id = Resource::create($data);
        Response::success(['id' => $id], 'Resource created', 201);
    }

    public static function updateResource(array $params): void
    {
        $id = (int)($params['id'] ?? 0);
        $data = Validator::getBody();
        $data = Validator::sanitizeArray($data, ['title', 'description', 'category', 'tags']);

        Resource::update($id, $data);
        Response::success(null, 'Resource updated');
    }

    public static function deleteResource(array $params): void
    {
        $id = (int)($params['id'] ?? 0);
        Resource::delete($id);
        Response::success(null, 'Resource deleted');
    }

    public static function getComments(array $params): void
    {
        $page = Validator::getPage();
        $limit = Validator::getLimit();
        $result = Comment::getAllPaginated($page, $limit);

        Response::paginated($result['data'], $result['total'], $page, $limit);
    }

    public static function moderateComment(array $params): void
    {
        $id = (int)($params['id'] ?? 0);
        $data = Validator::getBody();
        $action = $data['action'] ?? '';

        if ($action === 'delete') {
            Comment::delete($id);
            Response::success(null, 'Comment deleted');
        } elseif ($action === 'approve') {
            Comment::approve($id);
            Response::success(null, 'Comment approved');
        } else {
            Response::error('Invalid action', 400);
        }
    }

    public static function getSubscribers(array $params): void
    {
        $page = Validator::getPage();
        $limit = Validator::getLimit();
        $result = Newsletter::getAllPaginated($page, $limit);

        Response::paginated($result['data'], $result['total'], $page, $limit);
    }

    public static function exportSubscribers(array $params): void
    {
        $subscribers = Newsletter::getAllVerified();

        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="subscribers_' . date('Y-m-d') . '.csv"');

        $output = fopen('php://output', 'w');
        fputcsv($output, ['Email', 'Frequency']);

        foreach ($subscribers as $sub) {
            fputcsv($output, [$sub['email'], $sub['frequency']]);
        }

        fclose($output);
        exit;
    }

    public static function deleteSubscriber(array $params): void
    {
        $id = (int)($params['id'] ?? 0);
        Newsletter::delete($id);
        Response::success(null, 'Subscriber removed');
    }

    public static function syncFmhy(array $params): void
    {
        $db = Database::connect();

        // Log sync start
        $stmt = $db->prepare("INSERT INTO fmhy_sync_log (sync_type, status) VALUES ('manual', 'started')");
        $stmt->execute();
        $syncId = (int)$db->lastInsertId();

        try {
            // Fetch FMHY data
            $fmhyUrl = FMHY_API_URL;
            $context = stream_context_create([
                'http' => [
                    'timeout' => 30,
                    'header' => "Accept: application/json\r\n",
                ],
            ]);

            $response = @file_get_contents("$fmhyUrl/resources", false, $context);

            if ($response === false) {
                throw new \Exception('Failed to fetch FMHY data');
            }

            $data = json_decode($response, true);
            $resources = $data['data'] ?? $data ?? [];
            $synced = 0;

            foreach ($resources as $item) {
                $title = $item['title'] ?? $item['name'] ?? '';
                if (empty($title)) continue;

                $slug = Validator::slugify($title);
                $fmhyId = $item['id'] ?? $slug;

                // Check if already imported
                $checkStmt = $db->prepare('SELECT id FROM resources WHERE fmhy_source_id = ?');
                $checkStmt->execute([$fmhyId]);

                if ($checkStmt->fetch()) {
                    // Update existing
                    $updateStmt = $db->prepare(
                        'UPDATE resources SET title = ?, description = ?, tags = ?, updated_at = NOW() WHERE fmhy_source_id = ?'
                    );
                    $updateStmt->execute([
                        $title,
                        $item['description'] ?? '',
                        $item['tags'] ?? '',
                        $fmhyId,
                    ]);
                } else {
                    // Insert new
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

            // Log success
            $stmt = $db->prepare(
                "UPDATE fmhy_sync_log SET status = 'completed', records_synced = ?, completed_at = NOW() WHERE id = ?"
            );
            $stmt->execute([$synced, $syncId]);

            Response::success(['synced' => $synced], "Synced $synced resources from FMHY");
        } catch (\Exception $e) {
            // Log failure
            $stmt = $db->prepare(
                "UPDATE fmhy_sync_log SET status = 'failed', error_message = ?, completed_at = NOW() WHERE id = ?"
            );
            $stmt->execute([$e->getMessage(), $syncId]);

            Response::error('FMHY sync failed: ' . $e->getMessage(), 500);
        }
    }
}
