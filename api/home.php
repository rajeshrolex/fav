<?php
// api/home.php — Hero Slides CRUD + Image Upload + Reorder
require_once __DIR__ . '/../config/config.php';

$action = getAction();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET ───────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $db    = getDB();
    $rows  = $db->query('SELECT * FROM hero_slides ORDER BY display_order ASC, id ASC')->fetchAll();
    $formatted = array_map('formatSlide', $rows);
    json_success('Hero slides fetched successfully', $formatted);
}

// ── POST ──────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    if ($action === 'upload') {
        requireAuth();
        $result = handleUpload('file', 'home');
        json_success('Image uploaded successfully', $result);
    }

    $body = getRequestBody();

    if ($action === 'add') {
        requireAuth();
        $heading = sanitize($body['heading'] ?? $body['title'] ?? '');
        $image   = sanitize($body['image_url'] ?? $body['image'] ?? '');
        if ($image === '') {
            $image = 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?q=80&w=600';
        }
        if ($heading === '') {
            json_error('Banner title / heading is required');
        }

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'INSERT INTO hero_slides 
                 (image_url, badge, heading, description, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, display_order) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $image,
                sanitize($body['badge'] ?? ''),
                $heading,
                sanitize($body['description'] ?? ''),
                sanitize($body['primary_btn_text'] ?? $body['button_text'] ?? ''),
                sanitize($body['primary_btn_link'] ?? $body['button_link'] ?? ''),
                sanitize($body['secondary_btn_text'] ?? ''),
                sanitize($body['secondary_btn_link'] ?? ''),
                sanitizeInt($body['display_order'] ?? 0),
            ]);
            json_success('Hero slide added successfully', ['id' => (int) $db->lastInsertId()]);
        } catch (PDOException $e) {
            json_server_error('Failed to add slide: ' . $e->getMessage());
        }
    }

    if ($action === 'edit') {
        requireAuth();
        $id      = sanitizeInt($body['id'] ?? 0);
        $heading = sanitize($body['heading'] ?? $body['title'] ?? '');
        $image   = sanitize($body['image_url'] ?? $body['image'] ?? '');
        if ($image === '') {
            $image = 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?q=80&w=600';
        }
        if (!$id || $heading === '') {
            json_error('Slide ID and heading are required');
        }

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'UPDATE hero_slides SET 
                 image_url = ?, badge = ?, heading = ?, description = ?, 
                 primary_btn_text = ?, primary_btn_link = ?, 
                 secondary_btn_text = ?, secondary_btn_link = ?, display_order = ? 
                 WHERE id = ?'
            );
            $stmt->execute([
                $image,
                sanitize($body['badge'] ?? ''),
                $heading,
                sanitize($body['description'] ?? ''),
                sanitize($body['primary_btn_text'] ?? $body['button_text'] ?? ''),
                sanitize($body['primary_btn_link'] ?? $body['button_link'] ?? ''),
                sanitize($body['secondary_btn_text'] ?? ''),
                sanitize($body['secondary_btn_link'] ?? ''),
                sanitizeInt($body['display_order'] ?? 0),
                $id,
            ]);
            json_success('Hero slide updated successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to update slide: ' . $e->getMessage());
        }
    }

    if ($action === 'delete') {
        requireAuth();
        $id = sanitizeInt($body['id'] ?? 0);
        if (!$id) json_error('Slide ID is required');

        try {
            $db   = getDB();
            $stmt = $db->prepare('DELETE FROM hero_slides WHERE id = ?');
            $stmt->execute([$id]);
            json_success('Hero slide deleted successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to delete slide: ' . $e->getMessage());
        }
    }

    if ($action === 'reorder') {
        requireAuth();
        $orders = $body['orders'] ?? [];
        if (!is_array($orders) || empty($orders)) {
            json_error('Order data is required');
        }

        try {
            $db = getDB();
            $db->beginTransaction();
            $stmt = $db->prepare('UPDATE hero_slides SET display_order = ? WHERE id = ?');
            foreach ($orders as $slideId => $order) {
                $stmt->execute([sanitizeInt($order), sanitizeInt($slideId)]);
            }
            $db->commit();
            json_success('Slides reordered successfully');
        } catch (PDOException $e) {
            $db->rollBack();
            json_server_error('Failed to reorder slides: ' . $e->getMessage());
        }
    }
}

json_error('Invalid request', 400);

function formatSlide(array $s): array {
    $s['title']             = $s['heading'] ?? '';
    $s['heading']           = $s['heading'] ?? '';
    $s['image']             = $s['image_url'] ?? '';
    $s['button_text']       = $s['primary_btn_text'] ?? '';
    $s['button_link']       = $s['primary_btn_link'] ?? '';
    return $s;
}
