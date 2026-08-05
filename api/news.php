<?php
// api/news.php — News/Blog CRUD + Image Upload
require_once __DIR__ . '/../config/config.php';

$action = getAction();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET ───────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $db   = getDB();
    $slug = sanitize($_GET['slug'] ?? '');
    $id   = sanitizeInt($_GET['id'] ?? 0);

    if ($slug !== '') {
        $stmt = $db->prepare('SELECT * FROM news WHERE slug = ? LIMIT 1');
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if (!$row) json_not_found('Article not found');
        json_success('Article details loaded', formatArticle($row));
    }

    if ($id > 0) {
        $stmt = $db->prepare('SELECT * FROM news WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) json_not_found('Article not found');
        json_success('Article details loaded', formatArticle($row));
    }

    $rows = $db->query('SELECT * FROM news ORDER BY publish_date DESC, id DESC')->fetchAll();
    json_success('News articles loaded successfully', array_map('formatArticle', $rows));
}

// ── POST ──────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    if ($action === 'upload') {
        requireAuth();
        $result = handleUpload('file', 'news');
        json_success('Image uploaded successfully', $result);
    }

    $body = getRequestBody();

    if ($action === 'add') {
        requireAuth();
        $err = requireFields($body, ['title', 'content', 'publish_date']);
        if ($err) json_error($err);

        $title = sanitize($body['title']);
        $slug  = sanitize($body['slug'] ?? '') ?: makeSlug($title);
        $date  = sanitize($body['publish_date'] ?? $body['date'] ?? '');

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'INSERT INTO news 
                 (title, slug, category, author, summary, content, featured_image, publish_date, meta_title, meta_description) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $title,
                $slug,
                sanitize($body['category'] ?? 'General'),
                sanitize($body['author'] ?? ''),
                sanitize($body['summary'] ?? ''),
                sanitize($body['content'] ?? '', true),
                sanitize($body['featured_image'] ?? $body['image'] ?? $body['image_url'] ?? ''),
                $date,
                sanitize($body['meta_title'] ?? ''),
                sanitize($body['meta_description'] ?? ''),
            ]);
            $newsId = (int) $db->lastInsertId();
            json_success('News article created successfully', ['id' => $newsId, 'slug' => $slug]);
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                json_error('A news article with this slug already exists. Please use a unique title.');
            }
            json_server_error('Failed to create news: ' . $e->getMessage());
        }
    }

    if ($action === 'edit') {
        requireAuth();
        $id  = sanitizeInt($body['id'] ?? 0);
        $err = requireFields($body, ['id', 'title', 'content', 'publish_date']);
        if ($err) json_error($err);
        if (!$id) json_error('News ID is required');

        $title = sanitize($body['title']);
        $slug  = sanitize($body['slug'] ?? '') ?: makeSlug($title);
        $date  = sanitize($body['publish_date'] ?? $body['date'] ?? '');

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'UPDATE news SET 
                 title = ?, slug = ?, category = ?, author = ?, summary = ?, content = ?, 
                 featured_image = ?, publish_date = ?, meta_title = ?, meta_description = ? 
                 WHERE id = ?'
            );
            $stmt->execute([
                $title,
                $slug,
                sanitize($body['category'] ?? 'General'),
                sanitize($body['author'] ?? ''),
                sanitize($body['summary'] ?? ''),
                sanitize($body['content'] ?? '', true),
                sanitize($body['featured_image'] ?? $body['image'] ?? $body['image_url'] ?? ''),
                $date,
                sanitize($body['meta_title'] ?? ''),
                sanitize($body['meta_description'] ?? ''),
                $id,
            ]);
            json_success('News article updated successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to update news: ' . $e->getMessage());
        }
    }

    if ($action === 'delete') {
        requireAuth();
        $id = sanitizeInt($body['id'] ?? 0);
        if (!$id) json_error('News ID is required');

        try {
            $db   = getDB();
            $stmt = $db->prepare('DELETE FROM news WHERE id = ?');
            $stmt->execute([$id]);
            json_success('News article deleted successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to delete news: ' . $e->getMessage());
        }
    }
}

json_error('Invalid request', 400);

function formatArticle(array $n): array {
    $img                    = $n['featured_image'] ?? '';
    $date                   = $n['publish_date'] ?? '';
    $n['image']             = $img;
    $n['image_url']         = $img;
    $n['featured_image']    = $img;
    $n['date']              = $date;
    $n['publish_date']      = $date;
    return $n;
}
