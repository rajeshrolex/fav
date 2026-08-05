<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT key_name, key_value FROM settings");
    $rows = $stmt->fetchAll();

    $settings = [];
    foreach ($rows as $row) {
        $settings[$row['key_name']] = $row['key_value'];
    }

    $seoStmt = $pdo->query("SELECT * FROM seo_pages");
    $seoRows = $seoStmt->fetchAll();

    json_response(true, 'Settings fetched successfully', array_merge($settings, ['seo_pages' => $seoRows]));
}

if ($method === 'POST') {
    $body = get_body();

    if ($action === 'seo') {
        $authUser = get_auth_user();
        if (!$authUser) {
            json_response(false, 'Unauthorized', null, 401);
        }

        $page_name = isset($body['page_name']) ? trim($body['page_name']) : 'home';
        $meta_title = isset($body['meta_title']) ? trim($body['meta_title']) : '';
        $meta_description = isset($body['meta_description']) ? trim($body['meta_description']) : '';

        $stmt = $pdo->prepare("INSERT OR REPLACE INTO seo_pages (page_name, meta_title, meta_description) VALUES (?, ?, ?)");
        $stmt->execute([$page_name, $meta_title, $meta_description]);

        json_response(true, 'SEO settings updated successfully', null);
    }

    $authUser = get_auth_user();
    if (!$authUser) {
        json_response(false, 'Unauthorized', null, 401);
    }

    if (is_array($body)) {
        $stmt = $pdo->prepare("INSERT OR REPLACE INTO settings (key_name, key_value) VALUES (?, ?)");
        foreach ($body as $key => $val) {
            if ($key !== 'seo_pages' && is_string($key)) {
                $stmt->execute([$key, is_array($val) ? json_encode($val) : (string)$val]);
            }
        }
        json_response(true, 'Settings updated successfully', null);
    }

    json_response(false, 'Invalid body for settings update', null, 400);
}
