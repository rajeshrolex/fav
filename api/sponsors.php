<?php
// api/sponsors.php — Sponsors CRUD + Upload
require_once __DIR__ . '/../config/config.php';

$action = getAction();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET ───────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $isAdmin = isAdmin();
    $db      = getDB();
    $sql     = 'SELECT * FROM sponsors';
    if (!$isAdmin) {
        $sql .= ' WHERE is_active = 1';
    }
    $sql .= ' ORDER BY priority ASC, id DESC';

    $rows      = $db->query($sql)->fetchAll();
    $formatted = array_map('formatSponsor', $rows);
    json_success('Sponsors loaded successfully', $formatted);
}

// ── POST ──────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    if ($action === 'upload') {
        requireAuth();
        $result = handleUpload('file', 'sponsors');
        json_success('Logo uploaded successfully', $result);
    }

    $body = getRequestBody();

    if ($action === 'add') {
        requireAuth();
        $name   = sanitize($body['name'] ?? '');
        $logo   = sanitize($body['logo_url'] ?? $body['logo'] ?? '');
        if ($name === '' || $logo === '') {
            json_error('Sponsor name and logo URL are required');
        }

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'INSERT INTO sponsors (name, logo_url, website, category, priority, is_active) 
                 VALUES (?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $name,
                $logo,
                sanitize($body['website'] ?? $body['website_url'] ?? ''),
                sanitize($body['category'] ?? $body['tier'] ?? 'Bronze'),
                sanitizeInt($body['priority'] ?? 0),
                isset($body['is_active']) ? ($body['is_active'] ? 1 : 0) : 1,
            ]);
            json_success('Sponsor added successfully', ['id' => (int) $db->lastInsertId()]);
        } catch (PDOException $e) {
            json_server_error('Failed to add sponsor: ' . $e->getMessage());
        }
    }

    if ($action === 'edit') {
        requireAuth();
        $id   = sanitizeInt($body['id'] ?? 0);
        $name = sanitize($body['name'] ?? '');
        $logo = sanitize($body['logo_url'] ?? $body['logo'] ?? '');
        if (!$id || $name === '' || $logo === '') {
            json_error('ID, name and logo URL are required');
        }

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'UPDATE sponsors SET name = ?, logo_url = ?, website = ?, category = ?, priority = ?, is_active = ? WHERE id = ?'
            );
            $stmt->execute([
                $name,
                $logo,
                sanitize($body['website'] ?? $body['website_url'] ?? ''),
                sanitize($body['category'] ?? $body['tier'] ?? 'Bronze'),
                sanitizeInt($body['priority'] ?? 0),
                isset($body['is_active']) ? ($body['is_active'] ? 1 : 0) : 1,
                $id,
            ]);
            json_success('Sponsor updated successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to update sponsor: ' . $e->getMessage());
        }
    }

    if ($action === 'delete') {
        requireAuth();
        $id = sanitizeInt($body['id'] ?? 0);
        if (!$id) json_error('Sponsor ID is required');

        try {
            $db   = getDB();
            $stmt = $db->prepare('DELETE FROM sponsors WHERE id = ?');
            $stmt->execute([$id]);
            json_success('Sponsor deleted successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to delete sponsor: ' . $e->getMessage());
        }
    }
}

json_error('Invalid request', 400);

function formatSponsor(array $s): array {
    $logo            = $s['logo_url'] ?? '';
    $web             = $s['website'] ?? '';
    $s['tier']       = $s['category'] ?? 'Bronze';
    $s['logo']       = $logo;
    $s['logo_url']   = $logo;
    $s['website_url'] = $web;
    return $s;
}
