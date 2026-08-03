<?php
// api/sponsors.php
require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Retrieve sponsors
        try {
            $user = getAuthUser();
            // Admins see all; public only active
            if ($user) {
                $stmt = $pdo->query("SELECT * FROM sponsors ORDER BY priority ASC, id ASC");
            } else {
                $stmt = $pdo->query("SELECT * FROM sponsors WHERE is_active = 1 ORDER BY priority ASC, id ASC");
            }
            $sponsors = $stmt->fetchAll();
            sendResponse(true, "Sponsors fetched successfully", $sponsors);
        } catch (\PDOException $e) {
            sendResponse(false, "Failed to fetch sponsors: " . $e->getMessage(), null, 500);
        }
        break;

    case 'POST':
        $user = requireAuth(['Super Admin', 'Admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        if ($action === 'add') {
            $name = isset($input['name']) ? trim($input['name']) : '';
            $logoUrl = isset($input['logo_url']) ? trim($input['logo_url']) : '';

            if (empty($name) || empty($logoUrl)) {
                sendResponse(false, "Sponsor name and logo URL are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("INSERT INTO sponsors (name, logo_url, website, category, priority, is_active) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $name,
                    $logoUrl,
                    isset($input['website']) ? trim($input['website']) : null,
                    isset($input['category']) ? trim($input['category']) : 'Bronze',
                    isset($input['priority']) ? intval($input['priority']) : 0,
                    isset($input['is_active']) ? intval($input['is_active']) : 1
                ]);
                sendResponse(true, "Sponsor added successfully", ['id' => $pdo->lastInsertId()]);
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to add sponsor: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'edit') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            $name = isset($input['name']) ? trim($input['name']) : '';
            $logoUrl = isset($input['logo_url']) ? trim($input['logo_url']) : '';

            if (!$id || empty($name) || empty($logoUrl)) {
                sendResponse(false, "Sponsor ID, name, and logo URL are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("UPDATE sponsors SET name = ?, logo_url = ?, website = ?, category = ?, priority = ?, is_active = ? WHERE id = ?");
                $stmt->execute([
                    $name,
                    $logoUrl,
                    isset($input['website']) ? trim($input['website']) : null,
                    isset($input['category']) ? trim($input['category']) : 'Bronze',
                    isset($input['priority']) ? intval($input['priority']) : 0,
                    isset($input['is_active']) ? intval($input['is_active']) : 1,
                    $id
                ]);
                sendResponse(true, "Sponsor updated successfully");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to update sponsor: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'delete') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            if (!$id) {
                sendResponse(false, "Sponsor ID is required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("DELETE FROM sponsors WHERE id = ?");
                $stmt->execute([$id]);
                sendResponse(true, "Sponsor deleted successfully");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to delete sponsor: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'reorder') {
            $orders = isset($input['orders']) ? $input['orders'] : [];
            if (empty($orders)) {
                sendResponse(false, "Order details are required", null, 400);
            }

            try {
                $pdo->beginTransaction();
                $stmt = $pdo->prepare("UPDATE sponsors SET priority = ? WHERE id = ?");
                foreach ($orders as $id => $priority) {
                    $stmt->execute([intval($priority), intval($id)]);
                }
                $pdo->commit();
                sendResponse(true, "Sponsors priority updated successfully");
            } catch (\Exception $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                sendResponse(false, "Failed to reorder sponsors: " . $e->getMessage(), null, 500);
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
