<?php
// api/gallery.php
require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Retrieve gallery items with filters
        try {
            if ($action === 'meta') {
                // Fetch list of unique albums and categories for filters
                $albumStmt = $pdo->query("SELECT DISTINCT album_name FROM gallery WHERE album_name IS NOT NULL AND album_name != ''");
                $albums = $albumStmt->fetchAll(PDO::FETCH_COLUMN);

                $catStmt = $pdo->query("SELECT DISTINCT category FROM gallery WHERE category IS NOT NULL AND category != ''");
                $categories = $catStmt->fetchAll(PDO::FETCH_COLUMN);

                sendResponse(true, "Meta data loaded", [
                    'albums' => $albums,
                    'categories' => $categories
                ]);
            } else {
                $category = isset($_GET['category']) ? trim($_GET['category']) : '';
                $album = isset($_GET['album']) ? trim($_GET['album']) : '';
                $type = isset($_GET['type']) ? trim($_GET['type']) : '';
                $search = isset($_GET['search']) ? trim($_GET['search']) : '';

                $query = "SELECT * FROM gallery WHERE 1=1";
                $params = [];

                if (!empty($category)) {
                    $query .= " AND category = ?";
                    $params[] = $category;
                }
                if (!empty($album)) {
                    $query .= " AND album_name = ?";
                    $params[] = $album;
                }
                if (!empty($type)) {
                    $query .= " AND media_type = ?";
                    $params[] = $type;
                }
                if (!empty($search)) {
                    $query .= " AND (title LIKE ? OR category LIKE ? OR album_name LIKE ?)";
                    $params[] = "%$search%";
                    $params[] = "%$search%";
                    $params[] = "%$search%";
                }

                $query .= " ORDER BY created_at DESC, id DESC";
                
                $stmt = $pdo->prepare($query);
                $stmt->execute($params);
                $items = $stmt->fetchAll();
                sendResponse(true, "Gallery items fetched successfully", $items);
            }
        } catch (\PDOException $e) {
            sendResponse(false, "Failed to fetch gallery: " . $e->getMessage(), null, 500);
        }
        break;

    case 'POST':
        $user = requireAuth(['Super Admin', 'Admin', 'Editor']);
        $input = json_decode(file_get_contents('php://input'), true);

        if ($action === 'add') {
            $mediaUrl = isset($input['media_url']) ? trim($input['media_url']) : '';
            $mediaType = isset($input['media_type']) ? trim($input['media_type']) : 'image';

            if (empty($mediaUrl)) {
                sendResponse(false, "Media URL is required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("INSERT INTO gallery (title, category, album_name, media_type, media_url, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    isset($input['title']) ? trim($input['title']) : null,
                    isset($input['category']) ? trim($input['category']) : 'General',
                    isset($input['album_name']) ? trim($input['album_name']) : 'General',
                    $mediaType,
                    $mediaUrl,
                    isset($input['thumbnail_url']) ? trim($input['thumbnail_url']) : null
                ]);
                sendResponse(true, "Gallery item added successfully", ['id' => $pdo->lastInsertId()]);
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to add gallery item: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'add_multiple') {
            // Add multiple images
            $items = isset($input['items']) ? $input['items'] : [];
            if (empty($items) || !is_array($items)) {
                sendResponse(false, "Array of gallery items is required", null, 400);
            }

            try {
                $pdo->beginTransaction();
                $stmt = $pdo->prepare("INSERT INTO gallery (title, category, album_name, media_type, media_url) VALUES (?, ?, ?, 'image', ?)");
                foreach ($items as $item) {
                    $mediaUrl = isset($item['media_url']) ? trim($item['media_url']) : '';
                    if (!empty($mediaUrl)) {
                        $stmt->execute([
                            isset($item['title']) ? trim($item['title']) : null,
                            isset($item['category']) ? trim($item['category']) : 'General',
                            isset($item['album_name']) ? trim($item['album_name']) : 'General',
                            $mediaUrl
                        ]);
                    }
                }
                $pdo->commit();
                sendResponse(true, "Multiple items added to gallery successfully");
            } catch (\Exception $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                sendResponse(false, "Failed to add multiple items: " . $e->getMessage(), null, 500);
            }
        }
        elseif ($action === 'edit') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            if (!$id) {
                sendResponse(false, "ID is required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("UPDATE gallery SET title = ?, category = ?, album_name = ?, media_type = ?, media_url = ?, thumbnail_url = ? WHERE id = ?");
                $stmt->execute([
                    isset($input['title']) ? trim($input['title']) : null,
                    isset($input['category']) ? trim($input['category']) : 'General',
                    isset($input['album_name']) ? trim($input['album_name']) : 'General',
                    isset($input['media_type']) ? trim($input['media_type']) : 'image',
                    isset($input['media_url']) ? trim($input['media_url']) : '',
                    isset($input['thumbnail_url']) ? trim($input['thumbnail_url']) : null,
                    $id
                ]);
                sendResponse(true, "Gallery item updated successfully");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to update gallery item: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'delete') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            if (!$id) {
                sendResponse(false, "ID is required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("DELETE FROM gallery WHERE id = ?");
                $stmt->execute([$id]);
                sendResponse(true, "Gallery item deleted successfully");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to delete gallery item: " . $e->getMessage(), null, 500);
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
