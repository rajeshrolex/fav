<?php
// api/history.php — Festival History Milestones (uses about_timeline table)
require_once __DIR__ . '/../config/config.php';

$action = getAction();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET ───────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $db   = getDB();
    $rows = $db->query('SELECT * FROM about_timeline ORDER BY display_order ASC, year ASC, id DESC')->fetchAll();
    json_success('Festival history timeline retrieved successfully', $rows);
}

// ── POST ──────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    requireAuth();
    $body = getRequestBody();

    if ($action === 'add') {
        $err = requireFields($body, ['year', 'title', 'description']);
        if ($err) json_error($err);

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'INSERT INTO about_timeline (year, title, description, display_order) VALUES (?, ?, ?, ?)'
            );
            $stmt->execute([
                sanitize($body['year']),
                sanitize($body['title']),
                sanitize($body['description'], true),
                sanitizeInt($body['display_order'] ?? 0),
            ]);
            json_success('Historical milestone added successfully', ['id' => (int) $db->lastInsertId()]);
        } catch (PDOException $e) {
            json_server_error('Failed to add milestone: ' . $e->getMessage());
        }
    }

    if ($action === 'edit') {
        $id  = sanitizeInt($body['id'] ?? 0);
        $err = requireFields($body, ['year', 'title', 'description']);
        if ($err || !$id) json_error($err ?: 'ID is required');

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'UPDATE about_timeline SET year = ?, title = ?, description = ?, display_order = ? WHERE id = ?'
            );
            $stmt->execute([
                sanitize($body['year']),
                sanitize($body['title']),
                sanitize($body['description'], true),
                sanitizeInt($body['display_order'] ?? 0),
                $id,
            ]);
            json_success('Historical milestone updated successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to update milestone: ' . $e->getMessage());
        }
    }

    if ($action === 'delete') {
        $id = sanitizeInt($body['id'] ?? 0);
        if (!$id) json_error('Milestone ID is required');

        try {
            $db   = getDB();
            $stmt = $db->prepare('DELETE FROM about_timeline WHERE id = ?');
            $stmt->execute([$id]);
            json_success('Historical milestone deleted successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to delete milestone: ' . $e->getMessage());
        }
    }
}

json_error('Invalid request', 400);
