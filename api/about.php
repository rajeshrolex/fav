<?php
// api/about.php — About Page CRUD (text details + timeline)
require_once __DIR__ . '/../config/config.php';

$action = getAction();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET ───────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $db = getDB();

    // Get timeline
    $timelineStmt = $db->query('SELECT * FROM about_timeline ORDER BY display_order ASC, year ASC');
    $timeline     = $timelineStmt->fetchAll();

    // Get about-specific settings
    $keys = [
        'about_preview_title', 'about_preview_subtitle', 'about_preview_text1',
        'about_preview_text2', 'about_preview_mission', 'about_preview_vision',
        'about_preview_president_msg', 'about_preview_secretary_msg', 'about_history_full'
    ];
    $placeholders = implode(',', array_fill(0, count($keys), '?'));
    $settingsStmt = $db->prepare("SELECT * FROM settings WHERE key_name IN ({$placeholders})");
    $settingsStmt->execute($keys);
    $settingsRows = $settingsStmt->fetchAll();

    $details = array_fill_keys($keys, '');
    foreach ($settingsRows as $row) {
        $details[$row['key_name']] = $row['key_value'];
    }

    json_success('About page data loaded', ['timeline' => $timeline, 'details' => $details]);
}

// ── POST ──────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    requireAuth();
    $body = getRequestBody();

    if ($action === 'update') {
        // Bulk update about details (stored in settings table)
        try {
            $db = getDB();
            $db->beginTransaction();
            $stmt = $db->prepare('REPLACE INTO settings (key_name, key_value) VALUES (?, ?)');
            foreach ($body as $key => $val) {
                $key = sanitize($key);
                if ($key !== '') {
                    $stmt->execute([$key, $val !== null ? (string) $val : null]);
                }
            }
            $db->commit();
            json_success('About details updated successfully');
        } catch (PDOException $e) {
            $db->rollBack();
            json_server_error('Failed to update details: ' . $e->getMessage());
        }
    }

    if ($action === 'add-timeline') {
        $err = requireFields($body, ['year', 'title', 'description']);
        if ($err) json_error($err);

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'INSERT INTO about_timeline (year, title, description, display_order) VALUES (?, ?, ?, ?)'
            );
            $stmt->execute([
                sanitize($body['year']),
                sanitize($body['title']),
                sanitize($body['description'], true),
                sanitizeInt($body['display_order'] ?? 0),
            ]);
            json_success('Timeline event added successfully', ['id' => (int) $db->lastInsertId()]);
        } catch (PDOException $e) {
            json_server_error('Failed to add timeline event: ' . $e->getMessage());
        }
    }

    if ($action === 'edit-timeline') {
        $id  = sanitizeInt($body['id'] ?? 0);
        $err = requireFields($body, ['year', 'title', 'description']);
        if ($err || !$id) json_error($err ?: 'ID is required');

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'UPDATE about_timeline SET year = ?, title = ?, description = ?, display_order = ? WHERE id = ?'
            );
            $stmt->execute([
                sanitize($body['year']),
                sanitize($body['title']),
                sanitize($body['description'], true),
                sanitizeInt($body['display_order'] ?? 0),
                $id,
            ]);
            json_success('Timeline event updated successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to update timeline: ' . $e->getMessage());
        }
    }

    if ($action === 'delete-timeline') {
        $id = sanitizeInt($body['id'] ?? 0);
        if (!$id) json_error('Timeline event ID is required');

        try {
            $db   = getDB();
            $stmt = $db->prepare('DELETE FROM about_timeline WHERE id = ?');
            $stmt->execute([$id]);
            json_success('Timeline event deleted successfully');
        } catch (PDOException $e) {
            json_server_error('Failed to delete timeline event: ' . $e->getMessage());
        }
    }
}

json_error('Invalid request', 400);
