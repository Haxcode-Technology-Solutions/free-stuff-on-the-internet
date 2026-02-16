<?php

class BookmarkController
{
    public static function index(array $params): void
    {
        $userId = Auth::getUserId();
        $bookmarks = Bookmark::getByUser($userId);
        Response::success($bookmarks);
    }

    public static function toggle(array $params): void
    {
        $userId = Auth::getUserId();
        $resourceId = (int)($params['resourceId'] ?? 0);

        if ($resourceId <= 0) {
            Response::error('Invalid resource ID', 400);
        }

        $bookmarked = Bookmark::toggle($userId, $resourceId);
        Response::success([
            'bookmarked' => $bookmarked,
        ], $bookmarked ? 'Bookmarked' : 'Bookmark removed');
    }

    public static function check(array $params): void
    {
        $userId = Auth::getUserId();
        $resourceId = (int)($params['resourceId'] ?? 0);

        Response::success([
            'bookmarked' => Bookmark::exists($userId, $resourceId),
        ]);
    }
}
