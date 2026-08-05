<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'GET') {
    $authUser = get_auth_user();
    $sql = "SELECT * FROM sponsors";
    if (!$authUser) {
        $sql .= " WHERE is_active = 1";
    }
    $sql .= " ORDER BY priority ASC, id DESC";

    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll();

    $formatted = array_map(function($s) {
        $cat = !empty($s['category']) ? $s['category'] : (isset($s['tier']) ? $s['tier'] : 'Bronze');
        $logo = !empty($s['logo_url']) ? $s['logo_url'] : (isset($s['logo']) ? $s['logo'] : '');
        $web = !empty($s['website']) ? $s['website'] : (isset($s['website_url']) ? $s['website_url'] : '');
        $s['tier'] = $cat;
        $s['category'] = $cat;
        $s['logo'] = $logo;
        $s['logo_url'] = $logo;
        $s['website'] = $web;
        $s['website_url'] = $web;
        return $s;
    }, $rows);

    json_response(true, 'Sponsors loaded successfully', $formatted);
}

if ($method === 'POST') {
    $authUser = get_auth_user();
    if (!$authUser) {
        json_response(false, 'Unauthorized', null, 401);
    }

    $body = get_body();

    if ($action === 'add' || (!isset($body['id']) && $action !== 'edit' && $action !== 'delete')) {
        $name = isset($body['name']) ? trim($body['name']) : '';
        $logo = isset($body['logo_url']) ? trim($body['logo_url']) : (isset($body['logo']) ? trim($body['logo']) : '');
        $web = isset($body['website']) ? trim($body['website']) : (isset($body['website_url']) ? trim($body['website_url']) : '');
        $category = isset($body['category']) ? trim($body['category']) : (isset($body['tier']) ? trim($body['tier']) : 'Bronze');
        $priority = isset($body['priority']) ? intval($body['priority']) : 0;
        $is_active = isset($body['is_active']) ? ($body['is_active'] ? 1 : 0) : 1;

        if (empty($name) || empty($logo)) {
            json_response(false, 'Sponsor name and logo URL are required', null, 400);
        }

        $stmt = $pdo->prepare("INSERT INTO sponsors (name, logo_url, website, category, priority, is_active) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $logo, $web, $category, $priority, $is_active]);
        $id = $pdo->lastInsertId();

        json_response(true, 'Sponsor added successfully', ['id' => $id]);
    }

    if ($action === 'edit' || (isset($body['id']) && $action !== 'delete')) {
        $id = intval($body['id']);
        $name = isset($body['name']) ? trim($body['name']) : '';
        $logo = isset($body['logo_url']) ? trim($body['logo_url']) : (isset($body['logo']) ? trim($body['logo']) : '');
        $web = isset($body['website']) ? trim($body['website']) : (isset($body['website_url']) ? trim($body['website_url']) : '');
        $category = isset($body['category']) ? trim($body['category']) : (isset($body['tier']) ? trim($body['tier']) : 'Bronze');
        $priority = isset($body['priority']) ? intval($body['priority']) : 0;
        $is_active = isset($body['is_active']) ? ($body['is_active'] ? 1 : 0) : 1;

        if (!$id || empty($name) || empty($logo)) {
            json_response(false, 'ID, Sponsor name and logo URL are required', null, 400);
        }

        $stmt = $pdo->prepare("UPDATE sponsors SET name = ?, logo_url = ?, website = ?, category = ?, priority = ?, is_active = ? WHERE id = ?");
        $stmt->execute([$name, $logo, $web, $category, $priority, $is_active, $id]);

        json_response(true, 'Sponsor updated successfully', null);
    }

    if ($action === 'delete') {
        $id = isset($body['id']) ? intval($body['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);
        if (!$id) {
            json_response(false, 'Sponsor ID is required', null, 400);
        }

        $pdo->prepare("DELETE FROM sponsors WHERE id = ?")->execute([$id]);
        json_response(true, 'Sponsor deleted successfully', null);
    }
}
