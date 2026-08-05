<?php
// api/volunteers.php — Volunteer Applications CRUD
require_once __DIR__ . '/../config/config.php';

$action = getAction();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET ───────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    requireAuth();
    $db     = getDB();
    $sql    = 'SELECT * FROM volunteers';
    $params = [];

    if (!empty($_GET['status'])) {
        $sql    .= ' WHERE status = ?';
        $params[] = sanitize($_GET['status']);
    }
    $sql .= ' ORDER BY created_at DESC, id DESC';

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    json_success('Volunteers loaded successfully', $rows);
}

// ── POST ──────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    $body = getRequestBody();

    if ($action === 'apply') {
        // Public submission
        $err = requireFields($body, ['name', 'mobile', 'email']);
        if ($err) json_error($err);

        if (!isValidEmail($body['email'])) {
            json_error('Please provide a valid email address');
        }

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'INSERT INTO volunteers (name, mobile, email, address, skills, status) VALUES (?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                sanitize($body['name']),
                sanitize($body['mobile']),
                sanitize($body['email']),
                sanitize($body['address'] ?? ''),
                sanitize($body['skills'] ?? ''),
                'Pending',
            ]);
            json_success('Volunteer application submitted successfully!', ['id' => (int) $db->lastInsertId()]);
        } catch (PDOException $e) {
            json_server_error('Failed to submit application: ' . $e->getMessage());
        }
    }

    if ($action === 'update-status') {
        requireAuth();
        $id     = sanitizeInt($body['id'] ?? 0);
        $status = sanitize($body['status'] ?? '');
        if (!$id || $status === '') json_error('Volunteer ID and Status are required');

        $allowed = ['Pending', 'Approved', 'Rejected'];
        if (!in_array($status, $allowed, true)) {
            json_error('Status must be one of: ' . implode(', ', $allowed));
        }

        try {
            $db   = getDB();
            $stmt = $db->prepare('UPDATE volunteers SET status = ? WHERE id = ?');
            $stmt->execute([$status, $id]);
            json_success("Volunteer status updated to {$status}");
        } catch (PDOException $e) {
            json_server_error('Failed to update status: ' . $e->getMessage());
        }
    }

    if ($action === 'delete') {
        requireAuth();
        $id = sanitizeInt($body['id'] ?? 0);
        if (!$id) json_error('Volunteer ID is required');

        try {
            $db   = getDB();
            $stmt = $db->prepare('DELETE FROM volunteers WHERE id = ?');
            $stmt->execute([$id]);
            json_success('Volunteer application deleted successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to delete: ' . $e->getMessage());
        }
    }
}

json_error('Invalid request', 400);
