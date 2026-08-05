<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'GET') {
    $today = date('Y-m-d');

    if ($action === 'hit') {
        $pdo->prepare("INSERT OR IGNORE INTO visitor_stats (visit_date, hits) VALUES (?, 0)")->execute([$today]);
        $pdo->prepare("UPDATE visitor_stats SET hits = hits + 1 WHERE visit_date = ?")->execute([$today]);
        json_response(true, 'Hit recorded', null);
    }

    // Auto-record today visit
    try {
        $pdo->prepare("INSERT OR IGNORE INTO visitor_stats (visit_date, hits) VALUES (?, 0)")->execute([$today]);
        $pdo->prepare("UPDATE visitor_stats SET hits = hits + 1 WHERE visit_date = ?")->execute([$today]);
    } catch (Exception $e) {}

    $eventsCount = $pdo->query("SELECT COUNT(*) as count FROM events")->fetch()['count'];
    $volunteersCount = $pdo->query("SELECT COUNT(*) as count FROM volunteers WHERE status = 'Pending'")->fetch()['count'];
    $messagesCount = $pdo->query("SELECT COUNT(*) as count FROM contact_messages WHERE reply_status = 'Unread'")->fetch()['count'];
    $newsCount = $pdo->query("SELECT COUNT(*) as count FROM news")->fetch()['count'];
    $sponsorsCount = $pdo->query("SELECT COUNT(*) as count FROM sponsors")->fetch()['count'];
    $committeeCount = $pdo->query("SELECT COUNT(*) as count FROM committee_members")->fetch()['count'];

    $recentMessages = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5")->fetchAll();
    $recentVolunteers = $pdo->query("SELECT * FROM volunteers ORDER BY created_at DESC LIMIT 5")->fetchAll();
    $visitRows = $pdo->query("SELECT visit_date, hits FROM visitor_stats ORDER BY visit_date DESC LIMIT 7")->fetchAll();

    json_response(true, 'Dashboard statistics fetched successfully', [
        'counts' => [
            'events' => intval($eventsCount),
            'pending_volunteers' => intval($volunteersCount),
            'unread_messages' => intval($messagesCount),
            'news' => intval($newsCount),
            'sponsors' => intval($sponsorsCount),
            'committee' => intval($committeeCount)
        ],
        'recent_messages' => $recentMessages,
        'recent_volunteers' => $recentVolunteers,
        'visitor_chart' => array_reverse($visitRows)
    ]);
}
