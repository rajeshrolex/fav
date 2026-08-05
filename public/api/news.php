<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

if ($method === 'GET') {
    if (!empty($slug) || $action === 'get-by-slug') {
        $stmt = $pdo->prepare("SELECT * FROM news WHERE slug = ?");
        $stmt->execute([$slug]);
        $article = $stmt->fetch();

        if (!$article) {
            json_response(false, 'News article not found', null, 404);
        }
        json_response(true, 'News article fetched successfully', $article);
    }

    $stmt = $pdo->query("SELECT * FROM news ORDER BY publish_date DESC, id DESC");
    $rows = $stmt->fetchAll();

    json_response(true, 'News articles fetched successfully', $rows);
}

if ($method === 'POST') {
    $authUser = get_auth_user();
    if (!$authUser) {
        json_response(false, 'Unauthorized', null, 401);
    }

    $body = get_body();

    if ($action === 'add' || (!isset($body['id']) && $action !== 'edit' && $action !== 'delete')) {
        $title = isset($body['title']) ? trim($body['title']) : '';
        $customSlug = isset($body['slug']) ? trim($body['slug']) : '';
        $category = isset($body['category']) ? trim($body['category']) : 'General';
        $author = isset($body['author']) ? trim($body['author']) : 'Admin';
        $summary = isset($body['summary']) ? trim($body['summary']) : null;
        $content = isset($body['content']) ? trim($body['content']) : '';
        $featured_image = isset($body['featured_image']) ? trim($body['featured_image']) : null;
        $publish_date = isset($body['publish_date']) ? trim($body['publish_date']) : date('Y-m-d');
        $meta_title = isset($body['meta_title']) ? trim($body['meta_title']) : null;
        $meta_description = isset($body['meta_description']) ? trim($body['meta_description']) : null;

        if (empty($title) || empty($content)) {
            json_response(false, 'Title and Content are required', null, 400);
        }

        $finalSlug = !empty($customSlug) ? $customSlug : strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $title)) . '-' . time();

        $stmt = $pdo->prepare("INSERT INTO news (title, slug, category, author, summary, content, featured_image, publish_date, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $finalSlug, $category, $author, $summary, $content, $featured_image, $publish_date, $meta_title, $meta_description]);
        $id = $pdo->lastInsertId();

        json_response(true, 'News article created successfully', ['id' => $id, 'slug' => $finalSlug]);
    }

    if ($action === 'edit' || (isset($body['id']) && $action !== 'delete')) {
        $id = intval($body['id']);
        $title = isset($body['title']) ? trim($body['title']) : '';
        $category = isset($body['category']) ? trim($body['category']) : 'General';
        $author = isset($body['author']) ? trim($body['author']) : 'Admin';
        $summary = isset($body['summary']) ? trim($body['summary']) : null;
        $content = isset($body['content']) ? trim($body['content']) : '';
        $featured_image = isset($body['featured_image']) ? trim($body['featured_image']) : null;
        $publish_date = isset($body['publish_date']) ? trim($body['publish_date']) : date('Y-m-d');
        $meta_title = isset($body['meta_title']) ? trim($body['meta_title']) : null;
        $meta_description = isset($body['meta_description']) ? trim($body['meta_description']) : null;

        if (!$id || empty($title) || empty($content)) {
            json_response(false, 'ID, Title, and Content are required', null, 400);
        }

        $stmt = $pdo->prepare("UPDATE news SET title = ?, category = ?, author = ?, summary = ?, content = ?, featured_image = ?, publish_date = ?, meta_title = ?, meta_description = ? WHERE id = ?");
        $stmt->execute([$title, $category, $author, $summary, $content, $featured_image, $publish_date, $meta_title, $meta_description, $id]);

        json_response(true, 'News article updated successfully', null);
    }

    if ($action === 'delete') {
        $id = isset($body['id']) ? intval($body['id']) : (isset($_GET['id']) ? intval($_GET['id']) : 0);
        if (!$id) {
            json_response(false, 'Article ID is required', null, 400);
        }

        $pdo->prepare("DELETE FROM news WHERE id = ?")->execute([$id]);
        json_response(true, 'News article deleted successfully', null);
    }
}
