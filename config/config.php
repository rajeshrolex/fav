<?php
// config/config.php — Global configuration, CORS headers, session start

// ── Session ─────────────────────────────────────────────────────────────────
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_strict_mode', 1);
    session_start();
}

// ── CORS ─────────────────────────────────────────────────────────────────────
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    // On production same-domain, no CORS header needed.
    // Uncomment next line only if using a separate domain:
    // header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Constants ────────────────────────────────────────────────────────────────
define('UPLOAD_BASE_DIR', dirname(__DIR__) . '/uploads');
define('UPLOAD_BASE_URL', '/uploads');
define('JWT_SECRET', 'supersecret_festival_hub_jwt_key_2026');
define('MAX_UPLOAD_SIZE', 10 * 1024 * 1024); // 10 MB

// ── Includes ─────────────────────────────────────────────────────────────────
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validation.php';
require_once __DIR__ . '/../helpers/upload.php';
require_once __DIR__ . '/../middleware/auth.php';

// ── Utility: parse JSON body ──────────────────────────────────────────────────
function getRequestBody(): array {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (str_contains($contentType, 'application/json')) {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }
    // For multipart/form-data or application/x-www-form-urlencoded
    return array_merge($_POST, []);
}

// ── Utility: get query action ─────────────────────────────────────────────────
function getAction(): string {
    return strtolower(trim($_GET['action'] ?? $_POST['action'] ?? ''));
}
