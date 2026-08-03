<?php
// api/db.php

// CORS and API Header Configuration
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (!empty($origin)) {
    if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin)) {
        header("Access-Control-Allow-Origin: " . $origin);
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 86400"); // cache preflight for 1 day
    }
}

// Access-Control headers during PREFLIGHT (OPTIONS) requests
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    exit(0);
}

// Enable response header for JSON format
header('Content-Type: application/json; charset=UTF-8');

// Database credentials
$host = '127.0.0.1';
$db_name = 'festival_hub';
$username = 'root';
$password = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db_name;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (\PDOException $e) {
    if ($e->getCode() == 1049) {
        try {
            $tmpPdo = new PDO("mysql:host=$host;charset=$charset", $username, $password);
            $tmpPdo->exec("CREATE DATABASE IF NOT EXISTS festival_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
            $pdo = new PDO($dsn, $username, $password, $options);
        } catch (\PDOException $ex) {
            $pdo = initSQLiteFallback();
        }
    } else {
        $pdo = initSQLiteFallback();
    }
}

function initSQLiteFallback() {
    $sqlitePath = __DIR__ . '/database.sqlite';
    $pdo = new PDO("sqlite:" . $sqlitePath, null, null, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    $queries = [
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, email TEXT UNIQUE, password_hash TEXT, role TEXT DEFAULT 'Super Admin', reset_token TEXT, reset_token_expires DATETIME, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)",
        "CREATE TABLE IF NOT EXISTS settings (key_name TEXT PRIMARY KEY, key_value TEXT)",
        "CREATE TABLE IF NOT EXISTS seo_pages (page_name TEXT PRIMARY KEY, meta_title TEXT, meta_description TEXT, meta_keywords TEXT, og_title TEXT, og_description TEXT, og_image TEXT, twitter_title TEXT, twitter_description TEXT, twitter_image TEXT)",
        "CREATE TABLE IF NOT EXISTS hero_slides (id INTEGER PRIMARY KEY AUTOINCREMENT, image_url TEXT, badge TEXT, heading TEXT, description TEXT, primary_btn_text TEXT, primary_btn_link TEXT, secondary_btn_text TEXT, secondary_btn_link TEXT, display_order INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)",
        "CREATE TABLE IF NOT EXISTS about_timeline (id INTEGER PRIMARY KEY AUTOINCREMENT, year TEXT, title TEXT, description TEXT, display_order INTEGER DEFAULT 0)",
        "CREATE TABLE IF NOT EXISTS committee_members (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, position TEXT, department TEXT, photo_url TEXT, mobile TEXT, email TEXT, bio TEXT, display_order INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)",
        "CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, event_date DATE, event_time TEXT, venue TEXT, category TEXT DEFAULT 'General', cover_image TEXT, registration_link TEXT, status TEXT DEFAULT 'Upcoming', is_featured INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)",
        "CREATE TABLE IF NOT EXISTS gallery (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, category TEXT DEFAULT 'General', album_name TEXT DEFAULT 'General', media_type TEXT DEFAULT 'image', media_url TEXT, thumbnail_url TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)",
        "CREATE TABLE IF NOT EXISTS sponsors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, logo_url TEXT, website TEXT, category TEXT DEFAULT 'Bronze', priority INTEGER DEFAULT 0, is_active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)",
        "CREATE TABLE IF NOT EXISTS volunteers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, mobile TEXT, email TEXT, address TEXT, skills TEXT, status TEXT DEFAULT 'Pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)",
        "CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, subject TEXT, message TEXT, reply_status TEXT DEFAULT 'Unread', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)",
        "CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, category TEXT DEFAULT 'General', summary TEXT, content TEXT, cover_image TEXT, publish_date DATE, author TEXT, is_published INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)",
        "CREATE TABLE IF NOT EXISTS visitor_stats (visit_date DATE PRIMARY KEY, hits INTEGER DEFAULT 1)"
    ];
    foreach ($queries as $q) {
        $pdo->exec($q);
    }
    
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = 'superadmin'");
    $stmt->execute();
    if ($stmt->fetchColumn() == 0) {
        $passHash = password_hash('admin@123', PASSWORD_DEFAULT);
        $pdo->prepare("INSERT INTO users (username, email, password_hash, role) VALUES ('superadmin', 'superadmin@vikrin.org', ?, 'Super Admin')")->execute([$passHash]);
    }
    return $pdo;
}

// Helper to send JSON responses
if (!function_exists('sendResponse')) {
    function sendResponse($success, $message, $data = null, $code = 200) {
        http_response_code($code);
        echo json_encode([
            "success" => $success,
            "message" => $message,
            "data" => $data
        ]);
        exit();
    }
}

// Helper to check user roles/authentication from session or custom token
if (!function_exists('getAuthUser')) {
    function getAuthUser() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        if (isset($_SESSION['user_id'])) {
            return [
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username'],
                'email' => $_SESSION['email'],
                'role' => $_SESSION['role']
            ];
        }
        
        // Alternatively, check token in request headers
        $headers = getallheaders();
        $authHeader = '';
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
        } elseif (isset($headers['authorization'])) {
            $authHeader = $headers['authorization'];
        }
        
        if (!empty($authHeader) && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            // Decode simple token (base64 of user info or session id) for API access
            $decoded = json_decode(base64_decode($token), true);
            if ($decoded && isset($decoded['user_id']) && isset($decoded['expires']) && $decoded['expires'] > time()) {
                return [
                    'id' => $decoded['user_id'],
                    'username' => $decoded['username'],
                    'email' => $decoded['email'],
                    'role' => $decoded['role']
                ];
            }
        }
        
        return null;
    }
}

if (!function_exists('requireAuth')) {
    function requireAuth($allowedRoles = ['Super Admin', 'Admin', 'Editor']) {
        $user = getAuthUser();
        if (!$user) {
            sendResponse(false, "Authentication required", null, 401);
        }
        if (!in_array($user['role'], $allowedRoles)) {
            sendResponse(false, "Access denied: Insufficient permissions", null, 403);
        }
        return $user;
    }
}
