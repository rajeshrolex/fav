<?php
// api/settings.php — Site Settings + SEO
require_once __DIR__ . '/../config/config.php';

$action = getAction();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET ───────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $db = getDB();

    if ($action === 'seo') {
        $page = sanitize($_GET['page'] ?? '');
        if ($page !== '') {
            $stmt = $db->prepare('SELECT * FROM seo_pages WHERE page_name = ? LIMIT 1');
            $stmt->execute([$page]);
            $row = $stmt->fetch();
            if (!$row) {
                // Return empty record rather than 404 — easier for frontend
                json_success("SEO for page '{$page}'", [
                    'page_name' => $page,
                    'meta_title' => '', 'meta_description' => '',
                    'meta_keywords' => '', 'og_title' => '',
                    'og_description' => '', 'og_image' => '',
                    'twitter_title' => '', 'twitter_description' => '',
                    'twitter_image' => '',
                ]);
            }
            json_success("SEO for page '{$page}' fetched", $row);
        }

        $rows = $db->query('SELECT * FROM seo_pages')->fetchAll();
        json_success('All SEO configurations fetched', $rows);
    }

    // Default: return all settings as flat key→value object
    $rows   = $db->query('SELECT * FROM settings')->fetchAll();
    $config = [];
    foreach ($rows as $row) {
        $config[$row['key_name']] = $row['key_value'];
    }
    json_success('Settings loaded successfully', $config);
}

// ── POST ──────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    requireAuth();
    $body = getRequestBody();

    if ($action === 'update-seo') {
        $pageName = sanitize($body['page_name'] ?? '');
        if ($pageName === '') json_error('Page name is required');

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'REPLACE INTO seo_pages 
                 (page_name, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $pageName,
                sanitize($body['meta_title'] ?? ''),
                sanitize($body['meta_description'] ?? ''),
                sanitize($body['meta_keywords'] ?? ''),
                sanitize($body['og_title'] ?? ''),
                sanitize($body['og_description'] ?? ''),
                sanitize($body['og_image'] ?? ''),
                sanitize($body['twitter_title'] ?? ''),
                sanitize($body['twitter_description'] ?? ''),
                sanitize($body['twitter_image'] ?? ''),
            ]);
            json_success("SEO for page '{$pageName}' updated successfully");
        } catch (PDOException $e) {
            json_server_error('Failed to update SEO: ' . $e->getMessage());
        }
    }

    // Default action: bulk update settings
    if (!is_array($body) || empty($body)) {
        json_error('No settings provided');
    }

    try {
        $db = getDB();
        $db->beginTransaction();
        $stmt = $db->prepare('REPLACE INTO settings (key_name, key_value) VALUES (?, ?)');
        foreach ($body as $key => $val) {
            $key = sanitize((string) $key);
            if ($key !== '') {
                $stmt->execute([$key, $val !== null ? (string) $val : null]);
            }
        }
        $db->commit();
        json_success('Settings updated successfully');
    } catch (PDOException $e) {
        $db->rollBack();
        json_server_error('Failed to update settings: ' . $e->getMessage());
    }
}

json_error('Invalid request', 400);
