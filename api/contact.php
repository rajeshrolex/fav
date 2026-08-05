<?php
// api/contact.php — Contact Form Submissions
require_once __DIR__ . '/../config/config.php';

$action = getAction();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET: Admin list ───────────────────────────────────────────────────────────
if ($method === 'GET') {
    requireAuth();
    $db     = getDB();
    $sql    = 'SELECT * FROM contact_messages';
    $params = [];

    if (!empty($_GET['reply_status'])) {
        $sql    .= ' WHERE reply_status = ?';
        $params[] = sanitize($_GET['reply_status']);
    }
    $sql .= ' ORDER BY created_at DESC, id DESC';

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    json_success('Contact messages loaded successfully', $rows);
}

// ── POST ──────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    $body = getRequestBody();

    if ($action === 'submit' || $action === '') {
        // Public form submission
        $err = requireFields($body, ['name', 'email', 'message']);
        if ($err) json_error($err);

        if (!isValidEmail($body['email'])) {
            json_error('Please provide a valid email address');
        }

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'INSERT INTO contact_messages (name, email, subject, message, reply_status) VALUES (?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                sanitize($body['name']),
                sanitize($body['email']),
                sanitize($body['subject'] ?? ''),
                sanitize($body['message'], true),
                'Unread',
            ]);
            json_success('Your message has been sent successfully!', ['id' => (int) $db->lastInsertId()]);
        } catch (PDOException $e) {
            json_server_error('Failed to send message: ' . $e->getMessage());
        }
    }

    if ($action === 'update-status') {
        requireAuth();
        $id     = sanitizeInt($body['id'] ?? 0);
        $status = sanitize($body['reply_status'] ?? '');
        if (!$id || $status === '') json_error('Message ID and Reply Status are required');

        $allowed = ['Unread', 'Read', 'Replied'];
        if (!in_array($status, $allowed, true)) {
            json_error('Status must be one of: ' . implode(', ', $allowed));
        }

        try {
            $db   = getDB();
            $stmt = $db->prepare('UPDATE contact_messages SET reply_status = ? WHERE id = ?');
            $stmt->execute([$status, $id]);
            json_success("Reply status updated to {$status}");
        } catch (PDOException $e) {
            json_server_error('Failed to update status: ' . $e->getMessage());
        }
    }

    if ($action === 'delete') {
        requireAuth();
        $id = sanitizeInt($body['id'] ?? 0);
        if (!$id) json_error('Message ID is required');

        try {
            $db   = getDB();
            $stmt = $db->prepare('DELETE FROM contact_messages WHERE id = ?');
            $stmt->execute([$id]);
            json_success('Message deleted successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to delete message: ' . $e->getMessage());
        }
    }
}

// Allow public POST with no action (direct form submit)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = getRequestBody();
    if (!empty($body['name']) && !empty($body['email']) && !empty($body['message'])) {
        // Fallthrough: treat as submit
        if (!isValidEmail($body['email'])) {
            json_error('Please provide a valid email address');
        }
        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'INSERT INTO contact_messages (name, email, subject, message, reply_status) VALUES (?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                sanitize($body['name']),
                sanitize($body['email']),
                sanitize($body['subject'] ?? ''),
                sanitize($body['message'], true),
                'Unread',
            ]);
            json_success('Your message has been sent successfully!', ['id' => (int) $db->lastInsertId()]);
        } catch (PDOException $e) {
            json_server_error('Failed to send message: ' . $e->getMessage());
        }
    }
}

json_error('Invalid request', 400);
