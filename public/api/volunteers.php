<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'GET') {
    $status = isset($_GET['status']) ? trim($_GET['status']) : '';
    $sql = "SELECT * FROM volunteers";
    $params = [];

    if (!empty($status)) {
        $sql .= " WHERE status = ?";
        $params[] = $status;
    }
    $sql .= " ORDER BY created_at DESC, id DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    json_response(true, 'Volunteers loaded successfully', $rows);
}

if ($method === 'POST') {
    $body = get_body();

    if ($action === 'register' || (!isset($body['id']) && $action !== 'update-status' && $action !== 'delete')) {
        $name = isset($body['name']) ? trim($body['name']) : '';
        $mobile = isset($body['mobile']) ? trim($body['mobile']) : (isset($body['phone']) ? trim($body['phone']) : '');
        $email = isset($body['email']) ? trim($body['email']) : '';
        $address = isset($body['address']) ? trim($body['address']) : null;
        $skills = isset($body['skills']) ? trim($body['skills']) : null;

        if (empty($name) || empty($mobile) || empty($email)) {
            json_response(false, 'Name, Mobile, and Email are required', null, 400);
        }

        $stmt = $pdo->prepare("INSERT INTO volunteers (name, mobile, email, address, skills, status) VALUES (?, ?, ?, ?, ?, 'Pending')");
        $stmt->execute([$name, $mobile, $email, $address, $skills]);
        $id = $pdo->lastInsertId();

        json_response(true, 'Volunteer application submitted successfully!', ['id' => $id]);
    }

    $authUser = get_auth_user();
    if (!$authUser) {
        json_response(false, 'Unauthorized', null, 401);
    }

    if ($action === 'update-status') {
        $id = isset($body['id']) ? intval($body['id']) : 0;
        $status = isset($body['status']) ? trim($body['status']) : '';

        if (!$id || empty($status)) {
            json_response(false, 'Volunteer ID and Status are required', null, 400);
        }

        $stmt = $pdo->prepare("UPDATE volunteers SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        json_response(true, "Volunteer status updated to {$status}", null);
    }

    if ($action === 'delete') {
        $id = isset($body['id']) ? intval($body['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);
        if (!$id) {
            json_response(false, 'Volunteer ID is required', null, 400);
        }

        $pdo->prepare("DELETE FROM volunteers WHERE id = ?")->execute([$id]);
        json_response(true, 'Volunteer application deleted successfully', null);
    }
}
