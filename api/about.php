<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM about_timeline ORDER BY display_order ASC, id ASC");
    $rows = $stmt->fetchAll();

    json_response(true, 'Timeline items fetched successfully', $rows);
}

if ($method === 'POST') {
    $authUser = get_auth_user();
    if (!$authUser) {
        json_response(false, 'Unauthorized', null, 401);
    }

    $body = get_body();

    if ($action === 'add' || (!isset($body['id']) && $action !== 'edit' && $action !== 'delete')) {
        $year = isset($body['year']) ? trim($body['year']) : '';
        $title = isset($body['title']) ? trim($body['title']) : '';
        $description = isset($body['description']) ? trim($body['description']) : '';
        $display_order = isset($body['display_order']) ? intval($body['display_order']) : 0;

        if (empty($year) || empty($title) || empty($description)) {
            json_response(false, 'Year, Title, and Description are required', null, 400);
        }

        $stmt = $pdo->prepare("INSERT INTO about_timeline (year, title, description, display_order) VALUES (?, ?, ?, ?)");
        $stmt->execute([$year, $title, $description, $display_order]);
        $id = $pdo->lastInsertId();

        json_response(true, 'Timeline milestone added successfully', ['id' => $id]);
    }

    if ($action === 'edit' || (isset($body['id']) && $action !== 'delete')) {
        $id = intval($body['id']);
        $year = isset($body['year']) ? trim($body['year']) : '';
        $title = isset($body['title']) ? trim($body['title']) : '';
        $description = isset($body['description']) ? trim($body['description']) : '';
        $display_order = isset($body['display_order']) ? intval($body['display_order']) : 0;

        if (!$id || empty($year) || empty($title) || empty($description)) {
            json_response(false, 'ID, Year, Title, and Description are required', null, 400);
        }

        $stmt = $pdo->prepare("UPDATE about_timeline SET year = ?, title = ?, description = ?, display_order = ? WHERE id = ?");
        $stmt->execute([$year, $title, $description, $display_order, $id]);

        json_response(true, 'Timeline milestone updated successfully', null);
    }

    if ($action === 'delete') {
        $id = isset($body['id']) ? intval($body['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);
        if (!$id) {
            json_response(false, 'Milestone ID is required', null, 400);
        }

        $pdo->prepare("DELETE FROM about_timeline WHERE id = ?")->execute([$id]);
        json_response(true, 'Timeline milestone deleted successfully', null);
    }
}
