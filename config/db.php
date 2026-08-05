<?php
// config/db.php — PDO MySQL Singleton Connection

define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_USER', 'u177524058_Org_Temp');
define('DB_PASS', 'Vikrin@199');
define('DB_NAME', 'u177524058_Org_Temp');

$pdo = null;

function getDB(): PDO {
    global $pdo;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed: ' . $e->getMessage(),
                'data'    => null
            ]);
            exit;
        }
    }
    return $pdo;
}
