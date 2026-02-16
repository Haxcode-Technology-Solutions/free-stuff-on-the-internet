<?php

$router = Router::getInstance();

// --- Public routes ---

// Auth
$router->post('/auth/register', [AuthController::class, 'register'], [[RateLimit::class, 'check']]);
$router->post('/auth/login', [AuthController::class, 'login'], [[RateLimit::class, 'check']]);
$router->get('/auth/verify-email', [AuthController::class, 'verifyEmail']);
$router->post('/auth/forgot-password', [AuthController::class, 'forgotPassword'], [[RateLimit::class, 'check']]);
$router->post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Auth (protected)
$router->get('/auth/me', [AuthController::class, 'me'], [[Auth::class, 'requireAuth']]);
$router->put('/auth/profile', [AuthController::class, 'updateProfile'], [[Auth::class, 'requireAuth']]);

// Resources
$router->get('/resources', [ResourceController::class, 'index']);
$router->get('/resources/search', [ResourceController::class, 'search']);
$router->get('/resources/{slug}', [ResourceController::class, 'show']);
$router->get('/resources/{slug}/related', [ResourceController::class, 'related']);

// Categories
$router->get('/categories', [CategoryController::class, 'index']);
$router->get('/categories/{slug}/resources', [CategoryController::class, 'resources']);

// Comments (public read)
$router->get('/resources/{resourceId}/comments', [CommentController::class, 'index']);

// Comments (auth required)
$router->post('/resources/{resourceId}/comments', [CommentController::class, 'store'], [[Auth::class, 'requireAuth']]);
$router->delete('/comments/{id}', [CommentController::class, 'destroy'], [[Auth::class, 'requireAuth']]);

// Bookmarks (auth required)
$router->get('/bookmarks', [BookmarkController::class, 'index'], [[Auth::class, 'requireAuth']]);
$router->post('/bookmarks/{resourceId}', [BookmarkController::class, 'toggle'], [[Auth::class, 'requireAuth']]);
$router->get('/bookmarks/{resourceId}/check', [BookmarkController::class, 'check'], [[Auth::class, 'requireAuth']]);

// Newsletter
$router->post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'], [[RateLimit::class, 'check']]);
$router->get('/newsletter/verify/{token}', [NewsletterController::class, 'verify']);
$router->get('/newsletter/unsubscribe/{token}', [NewsletterController::class, 'unsubscribe']);

// --- Admin routes ---
$router->get('/admin/stats', [AdminController::class, 'stats'], [[Auth::class, 'requireAdmin']]);
$router->post('/admin/resources', [AdminController::class, 'createResource'], [[Auth::class, 'requireAdmin']]);
$router->put('/admin/resources/{id}', [AdminController::class, 'updateResource'], [[Auth::class, 'requireAdmin']]);
$router->delete('/admin/resources/{id}', [AdminController::class, 'deleteResource'], [[Auth::class, 'requireAdmin']]);
$router->get('/admin/comments', [AdminController::class, 'getComments'], [[Auth::class, 'requireAdmin']]);
$router->put('/admin/comments/{id}', [AdminController::class, 'moderateComment'], [[Auth::class, 'requireAdmin']]);
$router->get('/admin/subscribers', [AdminController::class, 'getSubscribers'], [[Auth::class, 'requireAdmin']]);
$router->get('/admin/subscribers/export', [AdminController::class, 'exportSubscribers'], [[Auth::class, 'requireAdmin']]);
$router->delete('/admin/subscribers/{id}', [AdminController::class, 'deleteSubscriber'], [[Auth::class, 'requireAdmin']]);
$router->post('/admin/sync-fmhy', [AdminController::class, 'syncFmhy'], [[Auth::class, 'requireAdmin']]);

// SEO
$router->get('/sitemap.xml', [ResourceController::class, 'sitemap']);
