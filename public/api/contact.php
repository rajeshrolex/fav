<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'GET') {
    $authUser = get_auth_user();
    if (!$authUser) {
        json_response(false, 'Unauthorized', null, 401);
    }

    $stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC");
    $rows = $stmt->fetchAll();

    json_response(true, 'Contact messages fetched successfully', $rows);
}

if ($method === 'POST') {
    $body = get_body();

    if ($action === 'send' || (!isset($body['id']) && $action !== 'reply' && $action !== 'delete')) {
        $name = isset($body['name']) ? trim($body['name']) : '';
        $email = isset($body['email']) ? trim($body['email']) : '';
        $subject = isset($body['subject']) ? trim($body['subject']) : null;
        $message = isset($body['message']) ? trim($body['message']) : '';

        if (empty($name) || empty($email) || empty($message)) {
            json_response(false, 'Name, Email, and Message are required', null, 400);
        }

        $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, subject, message, reply_status) VALUES (?, ?, ?, ?, 'Unread')");
        $stmt->execute([$name, $email, $subject, $message]);
        $id = $pdo->lastInsertId();

        json_response(true, 'Message sent successfully! We will get back to you soon.', ['id' => $id]);
    }

    $authUser = get_auth_user();
    if (!$authUser) {
        json_response(false, 'Unauthorized', null, 401);
    }

    if ($action === 'reply') {
        $id = isset($body['id']) ? intval($body['id']) : 0;
        $status = isset($body['reply_status']) ? trim($body['reply_status']) : 'Replied';

        if (!$id) {
            json_response(false, 'Message ID is required', null, 400);
        }

        $stmt = $pdo->prepare("UPDATE contact_messages SET reply_status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        json_response(true, "Message status updated to {$status}", null);
    }

    if ($action === 'delete') {
        $id = isset($body['id']) ? intval($body['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);
        if (!$id) {
            json_response(false, 'Message ID is required', null, 400);
        }

        $pdo->prepare("DELETE FROM contact_messages WHERE id = ?")->execute([$id]);
        json_response(true, 'Contact message deleted successfully', null);
    }
}
