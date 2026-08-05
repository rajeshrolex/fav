<?php
// api/gallery.php — Gallery CRUD + Upload router
require_once __DIR__ . '/../config/config.php';

$action = getAction();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET: List gallery ────────────────────────────────────────────────────────
if ($method === 'GET') {
    $db         = getDB();
    $conditions = [];
    $params     = [];

    if (!empty($_GET['category'])) {
        $conditions[] = 'category = ?';
        $params[]     = sanitize($_GET['category']);
    }
    if (!empty($_GET['album'])) {
        $conditions[] = 'album_name = ?';
        $params[]     = sanitize($_GET['album']);
    }

    $sql = 'SELECT * FROM gallery';
    if ($conditions) {
        $sql .= ' WHERE ' . implode(' AND ', $conditions);
    }
    $sql .= ' ORDER BY created_at DESC, id DESC';

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rows      = $stmt->fetchAll();
    $formatted = array_map('formatGalleryItem', $rows);
    json_success('Gallery media loaded successfully', $formatted);
}

// ── POST ─────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    if ($action === 'upload') {
        requireAuth();
        $result = handleUpload('file', 'gallery');
        // Auto-save to gallery table
        $db   = getDB();
        $stmt = $db->prepare(
            'INSERT INTO gallery (title, category, album_name, media_type, media_url, thumbnail_url) 
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $body = getRequestBody();
        $stmt->execute([
            sanitize($_POST['title'] ?? ''),
            sanitize($_POST['category'] ?? 'General'),
            sanitize($_POST['album_name'] ?? 'General'),
            in_array($result['ext'], ['mp4']) ? 'video' : 'image',
            $result['url'],
            null,
        ]);
        $result['id'] = (int) $db->lastInsertId();
        json_success('Media uploaded and added to gallery successfully', $result);
    }

    if ($action === 'add') {
        requireAuth();
        $body    = getRequestBody();
        $finalUrl = sanitize($body['media_url'] ?? $body['image_url'] ?? $body['image'] ?? '');
        if ($finalUrl === '') {
            json_error('Media URL is required');
        }

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'INSERT INTO gallery (title, category, album_name, media_type, media_url, thumbnail_url) 
                 VALUES (?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                sanitize($body['title'] ?? ''),
                sanitize($body['category'] ?? 'General'),
                sanitize($body['album_name'] ?? 'General'),
                sanitize($body['media_type'] ?? 'image'),
                $finalUrl,
                sanitize($body['thumbnail_url'] ?? ''),
            ]);
            json_success('Media added to gallery successfully', ['id' => (int) $db->lastInsertId()]);
        } catch (PDOException $e) {
            json_server_error('Failed to add media: ' . $e->getMessage());
        }
    }

    if ($action === 'delete') {
        requireAuth();
        $body   = getRequestBody();
        $itemId = sanitizeInt($body['id'] ?? 0);
        if (!$itemId) json_error('Media ID is required');

        try {
            $db   = getDB();
            $stmt = $db->prepare('DELETE FROM gallery WHERE id = ?');
            $stmt->execute([$itemId]);
            json_success('Media deleted from gallery successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to delete media: ' . $e->getMessage());
        }
    }
}

json_error('Invalid request', 400);

function formatGalleryItem(array $g): array {
    $url            = $g['media_url'] ?? '';
    $g['image']     = $url;
    $g['image_url'] = $url;
    $g['media_url'] = $url;
    return $g;
}
