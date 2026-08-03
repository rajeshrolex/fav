<?php
// api/news.php
require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        try {
            $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
            $slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';

            if ($id > 0) {
                $stmt = $pdo->prepare("SELECT * FROM news WHERE id = ?");
                $stmt->execute([$id]);
                $article = $stmt->fetch();
                if ($article) {
                    sendResponse(true, "Article details loaded", $article);
                } else {
                    sendResponse(false, "Article not found", null, 404);
                }
            } elseif (!empty($slug)) {
                $stmt = $pdo->prepare("SELECT * FROM news WHERE slug = ?");
                $stmt->execute([$slug]);
                $article = $stmt->fetch();
                if ($article) {
                    sendResponse(true, "Article details loaded by slug", $article);
                } else {
                    sendResponse(false, "Article not found", null, 404);
                }
            } else {
                // Fetch list of news
                $stmt = $pdo->query("SELECT id, title, slug, category, author, summary, featured_image, publish_date, created_at FROM news ORDER BY publish_date DESC, id DESC");
                $articles = $stmt->fetchAll();
                sendResponse(true, "Articles list loaded", $articles);
            }
        } catch (\PDOException $e) {
            sendResponse(false, "Failed to load articles: " . $e->getMessage(), null, 500);
        }
        break;

    case 'POST':
        $user = requireAuth(['Super Admin', 'Admin', 'Editor']);
        $input = json_decode(file_get_contents('php://input'), true);

        if ($action === 'add') {
            $title = isset($input['title']) ? trim($input['title']) : '';
            $slug = isset($input['slug']) ? trim($input['slug']) : '';
            $content = isset($input['content']) ? trim($input['content']) : '';
            $publishDate = isset($input['publish_date']) ? trim($input['publish_date']) : '';

            if (empty($title) || empty($slug) || empty($content) || empty($publishDate)) {
                sendResponse(false, "Title, URL Slug, Content, and Publish Date are required", null, 400);
            }

            // Ensure slug is clean and unique
            $slug = preg_replace('/[^a-z0-9\-]/', '', strtolower(str_replace(' ', '-', $slug)));
            
            try {
                // Check slug uniqueness
                $check = $pdo->prepare("SELECT id FROM news WHERE slug = ?");
                $check->execute([$slug]);
                if ($check->fetch()) {
                    $slug .= '-' . time();
                }

                $stmt = $pdo->prepare("INSERT INTO news 
                    (title, slug, category, author, summary, content, featured_image, publish_date, meta_title, meta_description) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $title,
                    $slug,
                    isset($input['category']) ? trim($input['category']) : 'General',
                    isset($input['author']) ? trim($input['author']) : 'Admin',
                    isset($input['summary']) ? trim($input['summary']) : null,
                    $content,
                    isset($input['featured_image']) ? trim($input['featured_image']) : null,
                    $publishDate,
                    isset($input['meta_title']) ? trim($input['meta_title']) : null,
                    isset($input['meta_description']) ? trim($input['meta_description']) : null
                ]);

                // Regenerate Sitemap since there is a new article
                require_once __DIR__ . '/settings.php';
                regenerateSitemap($pdo);

                sendResponse(true, "News article added successfully", ['id' => $pdo->lastInsertId(), 'slug' => $slug]);
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to create article: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'edit') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            $title = isset($input['title']) ? trim($input['title']) : '';
            $slug = isset($input['slug']) ? trim($input['slug']) : '';
            $content = isset($input['content']) ? trim($input['content']) : '';
            $publishDate = isset($input['publish_date']) ? trim($input['publish_date']) : '';

            if (!$id || empty($title) || empty($slug) || empty($content) || empty($publishDate)) {
                sendResponse(false, "ID, Title, Slug, Content, and Publish Date are required", null, 400);
            }

            $slug = preg_replace('/[^a-z0-9\-]/', '', strtolower(str_replace(' ', '-', $slug)));

            try {
                // Check slug uniqueness
                $check = $pdo->prepare("SELECT id FROM news WHERE slug = ? AND id != ?");
                $check->execute([$slug, $id]);
                if ($check->fetch()) {
                    $slug .= '-' . time();
                }

                $stmt = $pdo->prepare("UPDATE news SET 
                    title = ?, slug = ?, category = ?, author = ?, 
                    summary = ?, content = ?, featured_image = ?, publish_date = ?, 
                    meta_title = ?, meta_description = ? WHERE id = ?");
                $stmt->execute([
                    $title,
                    $slug,
                    isset($input['category']) ? trim($input['category']) : 'General',
                    isset($input['author']) ? trim($input['author']) : 'Admin',
                    isset($input['summary']) ? trim($input['summary']) : null,
                    $content,
                    isset($input['featured_image']) ? trim($input['featured_image']) : null,
                    $publishDate,
                    isset($input['meta_title']) ? trim($input['meta_title']) : null,
                    isset($input['meta_description']) ? trim($input['meta_description']) : null,
                    $id
                ]);

                // Regenerate sitemap
                require_once __DIR__ . '/settings.php';
                regenerateSitemap($pdo);

                sendResponse(true, "News article updated successfully", ['slug' => $slug]);
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to update article: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'delete') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            if (!$id) {
                sendResponse(false, "Article ID is required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
                $stmt->execute([$id]);
                
                // Regenerate sitemap
                require_once __DIR__ . '/settings.php';
                regenerateSitemap($pdo);

                sendResponse(true, "News article deleted successfully");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to delete article: " . $e->getMessage(), null, 500);
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
