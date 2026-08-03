<?php
// api/settings.php
require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if ($action === 'seo') {
            $page = isset($_GET['page']) ? trim($_GET['page']) : '';
            if (empty($page)) {
                // Return all page SEOs
                try {
                    $stmt = $pdo->query("SELECT * FROM seo_pages");
                    $seos = $stmt->fetchAll();
                    sendResponse(true, "All SEO configurations fetched", $seos);
                } catch (\PDOException $e) {
                    sendResponse(false, "Failed to fetch SEO: " . $e->getMessage(), null, 500);
                }
            } else {
                // Return specific page SEO
                try {
                    $stmt = $pdo->prepare("SELECT * FROM seo_pages WHERE page_name = ?");
                    $stmt->execute([$page]);
                    $seo = $stmt->fetch();
                    if ($seo) {
                        sendResponse(true, "SEO for page '$page' fetched", $seo);
                    } else {
                        sendResponse(false, "SEO for page '$page' not found", null, 404);
                    }
                } catch (\PDOException $e) {
                    sendResponse(false, "Failed to fetch SEO: " . $e->getMessage(), null, 500);
                }
            }
        } else {
            // Get all general settings
            try {
                $stmt = $pdo->query("SELECT * FROM settings");
                $rows = $stmt->fetchAll();
                $config = [];
                foreach ($rows as $row) {
                    $config[$row['key_name']] = $row['key_value'];
                }
                sendResponse(true, "Settings loaded successfully", $config);
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to fetch settings: " . $e->getMessage(), null, 500);
            }
        }
        break;

    case 'POST':
        $user = requireAuth(['Super Admin', 'Admin']);
        
        if ($action === 'seo') {
            $input = json_decode(file_get_contents('php://input'), true);
            $page = isset($input['page_name']) ? trim($input['page_name']) : '';
            
            if (empty($page)) {
                sendResponse(false, "Page name is required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("INSERT INTO seo_pages 
                    (page_name, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                    ON DUPLICATE KEY UPDATE 
                    meta_title=VALUES(meta_title), 
                    meta_description=VALUES(meta_description), 
                    meta_keywords=VALUES(meta_keywords), 
                    og_title=VALUES(og_title), 
                    og_description=VALUES(og_description), 
                    og_image=VALUES(og_image), 
                    twitter_title=VALUES(twitter_title), 
                    twitter_description=VALUES(twitter_description), 
                    twitter_image=VALUES(twitter_image)");
                
                $stmt->execute([
                    $page,
                    isset($input['meta_title']) ? $input['meta_title'] : null,
                    isset($input['meta_description']) ? $input['meta_description'] : null,
                    isset($input['meta_keywords']) ? $input['meta_keywords'] : null,
                    isset($input['og_title']) ? $input['og_title'] : null,
                    isset($input['og_description']) ? $input['og_description'] : null,
                    isset($input['og_image']) ? $input['og_image'] : null,
                    isset($input['twitter_title']) ? $input['twitter_title'] : null,
                    isset($input['twitter_description']) ? $input['twitter_description'] : null,
                    isset($input['twitter_image']) ? $input['twitter_image'] : null
                ]);

                // Regenerate sitemap after SEO changes
                regenerateSitemap($pdo);

                sendResponse(true, "SEO for page '$page' updated successfully");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to update SEO: " . $e->getMessage(), null, 500);
            }
        } 
        else {
            // Update general site settings
            $input = json_decode(file_get_contents('php://input'), true);
            if (!is_array($input)) {
                sendResponse(false, "Invalid payload", null, 400);
            }

            try {
                $pdo->beginTransaction();
                $stmt = $pdo->prepare("INSERT INTO settings (key_name, key_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE key_value=VALUES(key_value)");
                foreach ($input as $key => $value) {
                    $stmt->execute([$key, $value]);
                }
                $pdo->commit();

                // Regenerate robots.txt & Sitemap
                $siteUrl = 'http://localhost:3000'; // Default React URL
                regenerateRobotsTxt($siteUrl);
                regenerateSitemap($pdo, $siteUrl);

                sendResponse(true, "Settings updated successfully");
            } catch (\Exception $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                sendResponse(false, "Failed to update settings: " . $e->getMessage(), null, 500);
            }
        }
        break;

    default:
        sendResponse(false, "Request method not supported", null, 405);
        break;
}

// Function to regenerate robots.txt inside frontend public directory
function regenerateRobotsTxt($siteUrl) {
    $robotsPath = dirname(__DIR__) . '/public/robots.txt';
    $content = "User-agent: *\n";
    $content .= "Allow: /\n";
    $content .= "Disallow: /admin/\n";
    $content .= "\nSitemap: " . $siteUrl . "/sitemap.xml\n";
    @file_put_contents($robotsPath, $content);
}

// Function to regenerate sitemap.xml inside frontend public directory
function regenerateSitemap($pdo, $siteUrl = 'http://localhost:3000') {
    $sitemapPath = dirname(__DIR__) . '/public/sitemap.xml';
    
    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    
    // Standard Pages
    $pages = ['', '/about', '/committee', '/festival-history', '/events', '/gallery', '/sponsors', '/volunteer', '/contact', '/news'];
    foreach ($pages as $page) {
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($siteUrl . $page) . "</loc>\n";
        $xml .= "    <lastmod>" . date('Y-m-d') . "</lastmod>\n";
        $xml .= "    <changefreq>weekly</changefreq>\n";
        $xml .= "    <priority>" . ($page === '' ? '1.0' : '0.8') . "</priority>\n";
        $xml .= "  </url>\n";
    }

    // Dynamic News Articles from Database
    try {
        $stmt = $pdo->query("SELECT slug, DATE(created_at) as pub_date FROM news ORDER BY created_at DESC");
        $articles = $stmt->fetchAll();
        foreach ($articles as $art) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . htmlspecialchars($siteUrl . '/news/' . $art['slug']) . "</loc>\n";
            $xml .= "    <lastmod>" . $art['pub_date'] . "</lastmod>\n";
            $xml .= "    <changefreq>monthly</changefreq>\n";
            $xml .= "    <priority>0.6</priority>\n";
            $xml .= "  </url>\n";
        }
    } catch (\Exception $e) {
        // Log or ignore
    }

    $xml .= '</urlset>';
    @file_put_contents($sitemapPath, $xml);
}
