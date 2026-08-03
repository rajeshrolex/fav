<?php
// api/home.php
require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Publicly fetch hero slides
        try {
            $stmt = $pdo->query("SELECT * FROM hero_slides ORDER BY display_order ASC, id ASC");
            $slides = $stmt->fetchAll();
            sendResponse(true, "Hero slides fetched successfully", $slides);
        } catch (\PDOException $e) {
            sendResponse(false, "Failed to fetch hero slides: " . $e->getMessage(), null, 500);
        }
        break;

    case 'POST':
        $user = requireAuth(['Super Admin', 'Admin']);
        
        $input = json_decode(file_get_contents('php://input'), true);

        if ($action === 'add') {
            $imageUrl = isset($input['image_url']) ? trim($input['image_url']) : '';
            $heading = isset($input['heading']) ? trim($input['heading']) : '';
            if (empty($imageUrl) || empty($heading)) {
                sendResponse(false, "Image URL and heading are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("INSERT INTO hero_slides 
                    (image_url, badge, heading, description, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, display_order) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $imageUrl,
                    isset($input['badge']) ? trim($input['badge']) : null,
                    $heading,
                    isset($input['description']) ? trim($input['description']) : null,
                    isset($input['primary_btn_text']) ? trim($input['primary_btn_text']) : null,
                    isset($input['primary_btn_link']) ? trim($input['primary_btn_link']) : null,
                    isset($input['secondary_btn_text']) ? trim($input['secondary_btn_text']) : null,
                    isset($input['secondary_btn_link']) ? trim($input['secondary_btn_link']) : null,
                    isset($input['display_order']) ? intval($input['display_order']) : 0
                ]);
                sendResponse(true, "Hero slide added successfully", ['id' => $pdo->lastInsertId()]);
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to add slide: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'edit') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            $imageUrl = isset($input['image_url']) ? trim($input['image_url']) : '';
            $heading = isset($input['heading']) ? trim($input['heading']) : '';

            if (!$id || empty($imageUrl) || empty($heading)) {
                sendResponse(false, "Slide ID, Image URL, and heading are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("UPDATE hero_slides SET 
                    image_url = ?, badge = ?, heading = ?, description = ?, 
                    primary_btn_text = ?, primary_btn_link = ?, 
                    secondary_btn_text = ?, secondary_btn_link = ?, 
                    display_order = ? WHERE id = ?");
                $stmt->execute([
                    $imageUrl,
                    isset($input['badge']) ? trim($input['badge']) : null,
                    $heading,
                    isset($input['description']) ? trim($input['description']) : null,
                    isset($input['primary_btn_text']) ? trim($input['primary_btn_text']) : null,
                    isset($input['primary_btn_link']) ? trim($input['primary_btn_link']) : null,
                    isset($input['secondary_btn_text']) ? trim($input['secondary_btn_text']) : null,
                    isset($input['secondary_btn_link']) ? trim($input['secondary_btn_link']) : null,
                    isset($input['display_order']) ? intval($input['display_order']) : 0,
                    $id
                ]);
                sendResponse(true, "Hero slide updated successfully");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to update slide: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'delete') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            if (!$id) {
                sendResponse(false, "Slide ID is required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("DELETE FROM hero_slides WHERE id = ?");
                $stmt->execute([$id]);
                sendResponse(true, "Hero slide deleted successfully");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to delete slide: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'reorder') {
            $orders = isset($input['orders']) ? $input['orders'] : []; // [id => order]
            if (empty($orders)) {
                sendResponse(false, "Order details are required", null, 400);
            }

            try {
                $pdo->beginTransaction();
                $stmt = $pdo->prepare("UPDATE hero_slides SET display_order = ? WHERE id = ?");
                foreach ($orders as $id => $order) {
                    $stmt->execute([intval($order), intval($id)]);
                }
                $pdo->commit();
                sendResponse(true, "Slides reordered successfully");
            } catch (\Exception $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                sendResponse(false, "Failed to reorder slides: " . $e->getMessage(), null, 500);
            }
        } 
        else {
            sendResponse(false, "Invalid POST action", null, 400);
        }
        break;

    default:
        sendResponse(false, "Request method not supported", null, 405);
        break;
}
