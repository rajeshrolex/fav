<?php
// api/committee.php
require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Retrieve committee members
        try {
            $user = getAuthUser();
            // Admins see all; public only active
            if ($user) {
                $stmt = $pdo->query("SELECT * FROM committee_members ORDER BY display_order ASC, id ASC");
            } else {
                $stmt = $pdo->query("SELECT * FROM committee_members WHERE is_active = 1 ORDER BY display_order ASC, id ASC");
            }
            $members = $stmt->fetchAll();
            sendResponse(true, "Committee members fetched successfully", $members);
        } catch (\PDOException $e) {
            sendResponse(false, "Failed to fetch committee: " . $e->getMessage(), null, 500);
        }
        break;

    case 'POST':
        $user = requireAuth(['Super Admin', 'Admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        if ($action === 'add') {
            $name = isset($input['name']) ? trim($input['name']) : '';
            $position = isset($input['position']) ? trim($input['position']) : '';

            if (empty($name) || empty($position)) {
                sendResponse(false, "Name and position are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("INSERT INTO committee_members 
                    (name, position, department, photo_url, mobile, email, bio, display_order, is_active) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $name,
                    $position,
                    isset($input['department']) ? trim($input['department']) : null,
                    isset($input['photo_url']) ? trim($input['photo_url']) : null,
                    isset($input['mobile']) ? trim($input['mobile']) : null,
                    isset($input['email']) ? trim($input['email']) : null,
                    isset($input['bio']) ? trim($input['bio']) : null,
                    isset($input['display_order']) ? intval($input['display_order']) : 0,
                    isset($input['is_active']) ? intval($input['is_active']) : 1
                ]);
                sendResponse(true, "Committee member added successfully", ['id' => $pdo->lastInsertId()]);
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to add committee member: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'edit') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            $name = isset($input['name']) ? trim($input['name']) : '';
            $position = isset($input['position']) ? trim($input['position']) : '';

            if (!$id || empty($name) || empty($position)) {
                sendResponse(false, "ID, Name, and position are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("UPDATE committee_members SET 
                    name = ?, position = ?, department = ?, photo_url = ?, 
                    mobile = ?, email = ?, bio = ?, display_order = ?, is_active = ? 
                    WHERE id = ?");
                $stmt->execute([
                    $name,
                    $position,
                    isset($input['department']) ? trim($input['department']) : null,
                    isset($input['photo_url']) ? trim($input['photo_url']) : null,
                    isset($input['mobile']) ? trim($input['mobile']) : null,
                    isset($input['email']) ? trim($input['email']) : null,
                    isset($input['bio']) ? trim($input['bio']) : null,
                    isset($input['display_order']) ? intval($input['display_order']) : 0,
                    isset($input['is_active']) ? intval($input['is_active']) : 1,
                    $id
                ]);
                sendResponse(true, "Committee member updated successfully");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to update committee member: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'delete') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            if (!$id) {
                sendResponse(false, "Committee member ID is required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("DELETE FROM committee_members WHERE id = ?");
                $stmt->execute([$id]);
                sendResponse(true, "Committee member deleted successfully");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to delete committee member: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'reorder') {
            $orders = isset($input['orders']) ? $input['orders'] : []; // Array of [id => order]
            if (empty($orders)) {
                sendResponse(false, "Order details are required", null, 400);
            }

            try {
                $pdo->beginTransaction();
                $stmt = $pdo->prepare("UPDATE committee_members SET display_order = ? WHERE id = ?");
                foreach ($orders as $id => $order) {
                    $stmt->execute([intval($order), intval($id)]);
                }
                $pdo->commit();
                sendResponse(true, "Committee order updated successfully");
            } catch (\Exception $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                sendResponse(false, "Failed to reorder committee members: " . $e->getMessage(), null, 500);
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
