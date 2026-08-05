<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'GET') {
    $authUser = get_auth_user();
    $sql = "SELECT * FROM committee_members";
    if (!$authUser) {
        $sql .= " WHERE is_active = 1";
    }
    $sql .= " ORDER BY display_order ASC, id ASC";

    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll();

    $formatted = array_map(function($m) {
        $m['photo'] = !empty($m['photo_url']) ? $m['photo_url'] : (isset($m['photo']) ? $m['photo'] : '');
        $m['photo_url'] = $m['photo'];
        $m['role'] = !empty($m['position']) ? $m['position'] : (isset($m['role']) ? $m['role'] : '');
        $m['position'] = $m['role'];
        return $m;
    }, $rows);

    json_response(true, 'Committee members fetched successfully', $formatted);
}

if ($method === 'POST') {
    $authUser = get_auth_user();
    if (!$authUser) {
        json_response(false, 'Unauthorized', null, 401);
    }

    $body = get_body();

    if ($action === 'add' || (!isset($body['id']) && $action !== 'edit' && $action !== 'delete')) {
        $name = isset($body['name']) ? trim($body['name']) : '';
        $position = isset($body['position']) ? trim($body['position']) : (isset($body['role']) ? trim($body['role']) : '');
        $department = isset($body['department']) ? trim($body['department']) : null;
        $photo_url = isset($body['photo_url']) ? trim($body['photo_url']) : (isset($body['photo']) ? trim($body['photo']) : null);
        $mobile = isset($body['mobile']) ? trim($body['mobile']) : null;
        $email = isset($body['email']) ? trim($body['email']) : null;
        $bio = isset($body['bio']) ? trim($body['bio']) : null;
        $display_order = isset($body['display_order']) ? intval($body['display_order']) : 0;

        if (empty($name) || empty($position)) {
            json_response(false, 'Member name and position/role are required', null, 400);
        }

        $stmt = $pdo->prepare("INSERT INTO committee_members (name, position, department, photo_url, mobile, email, bio, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $position, $department, $photo_url, $mobile, $email, $bio, $display_order]);
        $id = $pdo->lastInsertId();

        json_response(true, 'Committee member added successfully', ['id' => $id]);
    }

    if ($action === 'edit' || (isset($body['id']) && $action !== 'delete')) {
        $id = intval($body['id']);
        $name = isset($body['name']) ? trim($body['name']) : '';
        $position = isset($body['position']) ? trim($body['position']) : (isset($body['role']) ? trim($body['role']) : '');
        $department = isset($body['department']) ? trim($body['department']) : null;
        $photo_url = isset($body['photo_url']) ? trim($body['photo_url']) : (isset($body['photo']) ? trim($body['photo']) : null);
        $mobile = isset($body['mobile']) ? trim($body['mobile']) : null;
        $email = isset($body['email']) ? trim($body['email']) : null;
        $bio = isset($body['bio']) ? trim($body['bio']) : null;
        $display_order = isset($body['display_order']) ? intval($body['display_order']) : 0;
        $is_active = isset($body['is_active']) ? ($body['is_active'] ? 1 : 0) : 1;

        if (!$id || empty($name) || empty($position)) {
            json_response(false, 'ID, Member name and position/role are required', null, 400);
        }

        $stmt = $pdo->prepare("UPDATE committee_members SET name = ?, position = ?, department = ?, photo_url = ?, mobile = ?, email = ?, bio = ?, display_order = ?, is_active = ? WHERE id = ?");
        $stmt->execute([$name, $position, $department, $photo_url, $mobile, $email, $bio, $display_order, $is_active, $id]);

        json_response(true, 'Committee member updated successfully', null);
    }

    if ($action === 'delete') {
        $id = isset($body['id']) ? intval($body['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);
        if (!$id) {
            json_response(false, 'Member ID is required', null, 400);
        }

        $pdo->prepare("DELETE FROM committee_members WHERE id = ?")->execute([$id]);
        json_response(true, 'Committee member deleted successfully', null);
    }
}
