<?php
// api/committee.php — Committee Members CRUD + Photo Upload
require_once __DIR__ . '/../config/config.php';

$action = getAction();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET ───────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $isAdmin = isAdmin();
    $db      = getDB();
    $sql     = 'SELECT * FROM committee_members';
    if (!$isAdmin) {
        $sql .= ' WHERE is_active = 1';
    }
    $sql .= ' ORDER BY display_order ASC, id DESC';

    $rows      = $db->query($sql)->fetchAll();
    $formatted = array_map('formatMember', $rows);
    json_success('Committee members loaded successfully', $formatted);
}

// ── POST ──────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    if ($action === 'upload') {
        requireAuth();
        $result = handleUpload('file', 'committee');
        json_success('Photo uploaded successfully', $result);
    }

    $body = getRequestBody();

    if ($action === 'add') {
        requireAuth();
        $name = sanitize($body['name'] ?? '');
        $pos  = sanitize($body['position'] ?? $body['role'] ?? '');
        if ($name === '' || $pos === '') {
            json_error('Name and Position are required');
        }

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'INSERT INTO committee_members 
                 (name, position, department, photo_url, mobile, email, bio, display_order, is_active) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $name,
                $pos,
                sanitize($body['department'] ?? ''),
                sanitize($body['photo_url'] ?? $body['image_url'] ?? $body['image'] ?? ''),
                sanitize($body['mobile'] ?? ''),
                sanitize($body['email'] ?? ''),
                sanitize($body['bio'] ?? '', true),
                sanitizeInt($body['display_order'] ?? 0),
                isset($body['is_active']) ? ($body['is_active'] ? 1 : 0) : 1,
            ]);
            json_success('Committee member added successfully', ['id' => (int) $db->lastInsertId()]);
        } catch (PDOException $e) {
            json_server_error('Failed to add committee member: ' . $e->getMessage());
        }
    }

    if ($action === 'edit') {
        requireAuth();
        $id   = sanitizeInt($body['id'] ?? 0);
        $name = sanitize($body['name'] ?? '');
        $pos  = sanitize($body['position'] ?? $body['role'] ?? '');
        if (!$id || $name === '' || $pos === '') {
            json_error('ID, Name, and Position are required');
        }

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'UPDATE committee_members SET 
                 name = ?, position = ?, department = ?, photo_url = ?, mobile = ?, 
                 email = ?, bio = ?, display_order = ?, is_active = ? WHERE id = ?'
            );
            $stmt->execute([
                $name,
                $pos,
                sanitize($body['department'] ?? ''),
                sanitize($body['photo_url'] ?? $body['image_url'] ?? $body['image'] ?? ''),
                sanitize($body['mobile'] ?? ''),
                sanitize($body['email'] ?? ''),
                sanitize($body['bio'] ?? '', true),
                sanitizeInt($body['display_order'] ?? 0),
                isset($body['is_active']) ? ($body['is_active'] ? 1 : 0) : 1,
                $id,
            ]);
            json_success('Committee member updated successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to update: ' . $e->getMessage());
        }
    }

    if ($action === 'delete') {
        requireAuth();
        $id = sanitizeInt($body['id'] ?? 0);
        if (!$id) json_error('Member ID is required');

        try {
            $db   = getDB();
            $stmt = $db->prepare('DELETE FROM committee_members WHERE id = ?');
            $stmt->execute([$id]);
            json_success('Committee member deleted successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to delete: ' . $e->getMessage());
        }
    }
}

json_error('Invalid request', 400);

function formatMember(array $m): array {
    $photo            = $m['photo_url'] ?? '';
    $m['role']        = $m['position'] ?? '';
    $m['image']       = $photo;
    $m['photo_url']   = $photo;
    $m['image_url']   = $photo;
    return $m;
}
