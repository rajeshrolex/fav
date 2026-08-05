<?php
// api/dashboard.php — Admin Dashboard Statistics
require_once __DIR__ . '/../config/config.php';

requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
$action = getAction();

if ($method === 'GET') {
    try {
        $db    = getDB();
        $today = date('Y-m-d');

        // Record today's visit (INSERT IGNORE + UPDATE pattern)
        $db->prepare('INSERT IGNORE INTO visitor_stats (visit_date, hits) VALUES (?, 0)')->execute([$today]);
        $db->prepare('UPDATE visitor_stats SET hits = hits + 1 WHERE visit_date = ?')->execute([$today]);

        // Count queries
        $eventsCount    = $db->query('SELECT COUNT(*) FROM events')->fetchColumn();
        $volCount       = $db->query("SELECT COUNT(*) FROM volunteers WHERE status = 'Pending'")->fetchColumn();
        $msgCount       = $db->query("SELECT COUNT(*) FROM contact_messages WHERE reply_status = 'Unread'")->fetchColumn();
        $newsCount      = $db->query('SELECT COUNT(*) FROM news')->fetchColumn();
        $sponsorsCount  = $db->query('SELECT COUNT(*) FROM sponsors')->fetchColumn();
        $committeeCount = $db->query('SELECT COUNT(*) FROM committee_members')->fetchColumn();
        $galleryCount   = $db->query('SELECT COUNT(*) FROM gallery')->fetchColumn();

        // Recent data
        $recentMessages   = $db->query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5')->fetchAll();
        $recentVolunteers = $db->query('SELECT * FROM volunteers ORDER BY created_at DESC LIMIT 5')->fetchAll();
        $recentEvents     = $db->query('SELECT * FROM events ORDER BY created_at DESC LIMIT 5')->fetchAll();

        // Visitor chart (last 7 days)
        $visitorRows = $db->query(
            'SELECT visit_date, hits FROM visitor_stats ORDER BY visit_date DESC LIMIT 7'
        )->fetchAll();

        json_success('Dashboard statistics fetched successfully', [
            'counts' => [
                'events'             => (int) $eventsCount,
                'pending_volunteers' => (int) $volCount,
                'unread_messages'    => (int) $msgCount,
                'news'               => (int) $newsCount,
                'sponsors'           => (int) $sponsorsCount,
                'committee'          => (int) $committeeCount,
                'gallery'            => (int) $galleryCount,
            ],
            'recent_messages'   => $recentMessages,
            'recent_volunteers' => $recentVolunteers,
            'recent_events'     => $recentEvents,
            'visitor_chart'     => array_reverse($visitorRows),
        ]);
    } catch (PDOException $e) {
        json_server_error('Failed to fetch dashboard stats: ' . $e->getMessage());
    }
}

if ($method === 'POST' && $action === 'record-hit') {
    // Public page view tracking (optional — can be called from frontend)
    try {
        $db    = getDB();
        $today = date('Y-m-d');
        $db->prepare('INSERT IGNORE INTO visitor_stats (visit_date, hits) VALUES (?, 0)')->execute([$today]);
        $db->prepare('UPDATE visitor_stats SET hits = hits + 1 WHERE visit_date = ?')->execute([$today]);
        json_success('Hit recorded');
    } catch (PDOException $e) {
        json_server_error($e->getMessage());
    }
}

json_error('Invalid request', 400);
