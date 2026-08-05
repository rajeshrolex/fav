<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM hero_slides ORDER BY display_order ASC, id ASC");
    $slides = $stmt->fetchAll();

    json_response(true, 'Home data loaded successfully', [
        'hero_slides' => $slides
    ]);
}

if ($method === 'POST') {
    $authUser = get_auth_user();
    if (!$authUser) {
        json_response(false, 'Unauthorized', null, 401);
    }

    $body = get_body();

    if ($action === 'add-slide' || (!isset($body['id']) && $action !== 'edit-slide' && $action !== 'delete-slide')) {
        $image_url = isset($body['image_url']) ? trim($body['image_url']) : (isset($body['image']) ? trim($body['image']) : '');
        $badge = isset($body['badge']) ? trim($body['badge']) : null;
        $heading = isset($body['heading']) ? trim($body['heading']) : (isset($body['title']) ? trim($body['title']) : '');
        $description = isset($body['description']) ? trim($body['description']) : null;
        $primary_btn_text = isset($body['primary_btn_text']) ? trim($body['primary_btn_text']) : null;
        $primary_btn_link = isset($body['primary_btn_link']) ? trim($body['primary_btn_link']) : null;
        $secondary_btn_text = isset($body['secondary_btn_text']) ? trim($body['secondary_btn_text']) : null;
        $secondary_btn_link = isset($body['secondary_btn_link']) ? trim($body['secondary_btn_link']) : null;
        $display_order = isset($body['display_order']) ? intval($body['display_order']) : 0;

        if (empty($image_url) || empty($heading)) {
            json_response(false, 'Image URL and Heading/Title are required', null, 400);
        }

        $stmt = $pdo->prepare("INSERT INTO hero_slides (image_url, badge, heading, description, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$image_url, $badge, $heading, $description, $primary_btn_text, $primary_btn_link, $secondary_btn_text, $secondary_btn_link, $display_order]);
        $id = $pdo->lastInsertId();

        json_response(true, 'Hero slide added successfully', ['id' => $id]);
    }

    if ($action === 'edit-slide' || (isset($body['id']) && $action !== 'delete-slide')) {
        $id = intval($body['id']);
        $image_url = isset($body['image_url']) ? trim($body['image_url']) : (isset($body['image']) ? trim($body['image']) : '');
        $badge = isset($body['badge']) ? trim($body['badge']) : null;
        $heading = isset($body['heading']) ? trim($body['heading']) : (isset($body['title']) ? trim($body['title']) : '');
        $description = isset($body['description']) ? trim($body['description']) : null;
        $primary_btn_text = isset($body['primary_btn_text']) ? trim($body['primary_btn_text']) : null;
        $primary_btn_link = isset($body['primary_btn_link']) ? trim($body['primary_btn_link']) : null;
        $secondary_btn_text = isset($body['secondary_btn_text']) ? trim($body['secondary_btn_text']) : null;
        $secondary_btn_link = isset($body['secondary_btn_link']) ? trim($body['secondary_btn_link']) : null;
        $display_order = isset($body['display_order']) ? intval($body['display_order']) : 0;

        if (!$id || empty($image_url) || empty($heading)) {
            json_response(false, 'ID, Image URL and Heading are required', null, 400);
        }

        $stmt = $pdo->prepare("UPDATE hero_slides SET image_url = ?, badge = ?, heading = ?, description = ?, primary_btn_text = ?, primary_btn_link = ?, secondary_btn_text = ?, secondary_btn_link = ?, display_order = ? WHERE id = ?");
        $stmt->execute([$image_url, $badge, $heading, $description, $primary_btn_text, $primary_btn_link, $secondary_btn_text, $secondary_btn_link, $display_order, $id]);

        json_response(true, 'Hero slide updated successfully', null);
    }

    if ($action === 'delete-slide') {
        $id = isset($body['id']) ? intval($body['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);
        if (!$id) {
            json_response(false, 'Slide ID is required', null, 400);
        }

        $pdo->prepare("DELETE FROM hero_slides WHERE id = ?")->execute([$id]);
        json_response(true, 'Hero slide deleted successfully', null);
    }
}
