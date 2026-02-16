<?php

declare(strict_types=1);

// Error reporting (disable display in production)
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Load config
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/cors.php';

// Handle CORS
handleCors();

// Set JSON content type
header('Content-Type: application/json; charset=utf-8');

// Autoload helpers
require_once __DIR__ . '/helpers/Response.php';
require_once __DIR__ . '/helpers/JWT.php';
require_once __DIR__ . '/helpers/Validator.php';
require_once __DIR__ . '/helpers/Mailer.php';

// Load middleware
require_once __DIR__ . '/middleware/Auth.php';
require_once __DIR__ . '/middleware/RateLimit.php';

// Load models
require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/models/Resource.php';
require_once __DIR__ . '/models/Comment.php';
require_once __DIR__ . '/models/Bookmark.php';
require_once __DIR__ . '/models/Newsletter.php';
require_once __DIR__ . '/models/Category.php';

// Load controllers
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ResourceController.php';
require_once __DIR__ . '/controllers/CommentController.php';
require_once __DIR__ . '/controllers/BookmarkController.php';
require_once __DIR__ . '/controllers/NewsletterController.php';
require_once __DIR__ . '/controllers/CategoryController.php';
require_once __DIR__ . '/controllers/AdminController.php';

// Load router
require_once __DIR__ . '/routes/Router.php';
require_once __DIR__ . '/routes/api.php';

// Dispatch
$router = Router::getInstance();
$router->dispatch();
