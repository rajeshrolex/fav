<?php
// api/about.php
require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Fetch about timeline and details
        try {
            $stmt = $pdo->query("SELECT * FROM about_timeline ORDER BY display_order ASC, year ASC");
            $timeline = $stmt->fetchAll();

            // Fetch about-specific settings
            $keys = [
                'about_preview_title', 'about_preview_subtitle', 'about_preview_text1', 
                'about_preview_text2', 'about_preview_mission', 'about_preview_vision',
                'about_preview_president_msg', 'about_preview_secretary_msg', 'about_history_full'
            ];
            
            // Build placeholders for SQL IN
            $inQuery = implode(',', array_fill(0, count($keys), '?'));
            $setStmt = $pdo->prepare("SELECT * FROM settings WHERE key_name IN ($inQuery)");
            $setStmt->execute($keys);
            $rows = $setStmt->fetchAll();
            
            $details = [];
            foreach ($keys as $k) {
                $details[$k] = ''; // default empty
            }
            foreach ($rows as $row) {
                $details[$row['key_name']] = $row['key_value'];
            }

            sendResponse(true, "About page data loaded", [
                'timeline' => $timeline,
                'details' => $details
            ]);
        } catch (\PDOException $e) {
            sendResponse(false, "Failed to load About details: " . $e->getMessage(), null, 500);
        }
        break;

    case 'POST':
        $user = requireAuth(['Super Admin', 'Admin']);
        $input = json_decode(file_get_contents('php://input'), true);

        if ($action === 'add_timeline') {
            $year = isset($input['year']) ? trim($input['year']) : '';
            $title = isset($input['title']) ? trim($input['title']) : '';
            $description = isset($input['description']) ? trim($input['description']) : '';

            if (empty($year) || empty($title) || empty($description)) {
                sendResponse(false, "Year, title, and description are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("INSERT INTO about_timeline (year, title, description, display_order) VALUES (?, ?, ?, ?)");
                $stmt->execute([
                    $year,
                    $title,
                    $description,
                    isset($input['display_order']) ? intval($input['display_order']) : 0
                ]);
                sendResponse(true, "Timeline event added successfully", ['id' => $pdo->lastInsertId()]);
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to add timeline event: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'edit_timeline') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            $year = isset($input['year']) ? trim($input['year']) : '';
            $title = isset($input['title']) ? trim($input['title']) : '';
            $description = isset($input['description']) ? trim($input['description']) : '';

            if (!$id || empty($year) || empty($title) || empty($description)) {
                sendResponse(false, "ID, Year, title, and description are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("UPDATE about_timeline SET year = ?, title = ?, description = ?, display_order = ? WHERE id = ?");
                $stmt->execute([
                    $year,
                    $title,
                    $description,
                    isset($input['display_order']) ? intval($input['display_order']) : 0,
                    $id
                ]);
                sendResponse(true, "Timeline event updated successfully");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to update timeline event: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'delete_timeline') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            if (!$id) {
                sendResponse(false, "Timeline event ID is required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("DELETE FROM about_timeline WHERE id = ?");
                $stmt->execute([$id]);
                sendResponse(true, "Timeline event deleted successfully");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to delete timeline event: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'update_details') {
            try {
                $pdo->beginTransaction();
                $stmt = $pdo->prepare("INSERT INTO settings (key_name, key_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE key_value = VALUES(key_value)");
                foreach ($input as $key => $val) {
                    $stmt->execute([$key, $val]);
                }
                $pdo->commit();
                sendResponse(true, "About details updated successfully");
            } catch (\Exception $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                sendResponse(false, "Failed to update details: " . $e->getMessage(), null, 500);
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
