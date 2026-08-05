<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'GET') {
    if ($action === 'albums') {
        $stmt = $pdo->query("SELECT DISTINCT album_name FROM gallery WHERE album_name IS NOT NULL AND album_name != ''");
        $albums = $stmt->fetchAll(PDO::FETCH_COLUMN);
        json_response(true, 'Albums fetched successfully', $albums);
    }

    $category = isset($_GET['category']) ? trim($_GET['category']) : '';
    $album = isset($_GET['album']) ? trim($_GET['album']) : '';

    $sql = "SELECT * FROM gallery";
    $where = [];
    $params = [];

    if (!empty($category)) {
        $where[] = "category = ?";
        $params[] = $category;
    }
    if (!empty($album)) {
        $where[] = "album_name = ?";
        $params[] = $album;
    }

    if (count($where) > 0) {
        $sql .= " WHERE " . implode(" AND ", $where);
    }
    $sql .= " ORDER BY created_at DESC, id DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $formatted = array_map(function($g) {
        $url = !empty($g['media_url']) ? $g['media_url'] : (!empty($g['image_url']) ? $g['image_url'] : $g['thumbnail_url']);
        $g['image'] = $url;
        $g['image_url'] = $url;
        $g['media_url'] = $url;
        return $g;
    }, $rows);

    json_response(true, 'Gallery media loaded successfully', $formatted);
}

if ($method === 'POST') {
    $authUser = get_auth_user();
    if (!$authUser) {
        json_response(false, 'Unauthorized', null, 401);
    }

    $body = get_body();

    if ($action === 'add' || (!isset($body['id']) && $action !== 'delete')) {
        $title = isset($body['title']) ? trim($body['title']) : null;
        $category = isset($body['category']) ? trim($body['category']) : 'General';
        $album_name = isset($body['album_name']) ? trim($body['album_name']) : 'General';
        $media_type = isset($body['media_type']) ? trim($body['media_type']) : 'image';
        $media_url = isset($body['media_url']) ? trim($body['media_url']) : (isset($body['image_url']) ? trim($body['image_url']) : (isset($body['image']) ? trim($body['image']) : ''));
        $thumbnail_url = isset($body['thumbnail_url']) ? trim($body['thumbnail_url']) : null;

        if (empty($media_url)) {
            json_response(false, 'Media URL is required', null, 400);
        }

        $stmt = $pdo->prepare("INSERT INTO gallery (title, category, album_name, media_type, media_url, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $category, $album_name, $media_type, $media_url, $thumbnail_url]);
        $id = $pdo->lastInsertId();

        json_response(true, 'Media added to gallery successfully', ['id' => $id]);
    }

    if ($action === 'delete') {
        $id = isset($body['id']) ? intval($body['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);
        if (!$id) {
            json_response(false, 'Media ID is required', null, 400);
        }

        $pdo->prepare("DELETE FROM gallery WHERE id = ?")->execute([$id]);
        json_response(true, 'Media deleted from gallery successfully', null);
    }
}
