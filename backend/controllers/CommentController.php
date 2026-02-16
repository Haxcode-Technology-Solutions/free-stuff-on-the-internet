<?php

class CommentController
{
    public static function index(array $params): void
    {
        $resourceId = (int)($params['resourceId'] ?? 0);
        if ($resourceId <= 0) {
            Response::error('Invalid resource ID', 400);
        }

        $comments = Comment::getByResource($resourceId);
        Response::success($comments);
    }

    public static function store(array $params): void
    {
        $resourceId = (int)($params['resourceId'] ?? 0);
        if ($resourceId <= 0) {
            Response::error('Invalid resource ID', 400);
        }

        $userId = Auth::getUserId();
        $data = Validator::getBody();
        $comment = Validator::sanitize($data['comment'] ?? '');
        $parentId = isset($data['parent_id']) ? (int)$data['parent_id'] : null;

        if (empty($comment)) {
            Response::error('Comment text is required', 422);
        }

        if (!Validator::maxLength($comment, 2000)) {
            Response::error('Comment is too long (max 2000 characters)', 422);
        }

        // Validate parent comment exists if replying
        if ($parentId) {
            $parent = Comment::findById($parentId);
            if (!$parent || (int)$parent['resource_id'] !== $resourceId) {
                Response::error('Invalid parent comment', 400);
            }
        }

        $commentId = Comment::create($userId, $resourceId, $comment, $parentId);
        Response::success(['id' => $commentId], 'Comment added successfully', 201);
    }

    public static function destroy(array $params): void
    {
        $commentId = (int)($params['id'] ?? 0);
        $userId = Auth::getUserId();
        $user = Auth::getUser();

        $comment = Comment::findById($commentId);
        if (!$comment) {
            Response::error('Comment not found', 404);
        }

        // Only owner or admin can delete
        if ((int)$comment['user_id'] !== $userId && $user['role'] !== 'admin') {
            Response::error('Not authorized to delete this comment', 403);
        }

        Comment::delete($commentId);
        Response::success(null, 'Comment deleted');
    }
}
