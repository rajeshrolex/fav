<?php
// api/dashboard.php
require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Tracking page hits
if ($action === 'hit') {
    try {
        $today = date('Y-m-d');
        $stmt = $pdo->prepare("INSERT INTO visitor_stats (visit_date, hits) VALUES (?, 1) ON DUPLICATE KEY UPDATE hits = hits + 1");
        $stmt->execute([$today]);
        sendResponse(true, "Hit registered");
    } catch (\PDOException $e) {
        sendResponse(false, "Failed to register hit: " . $e->getMessage(), null, 500);
    }
}

// Fetching Dashboard stats for Admins
$user = requireAuth();

try {
    // Total Visitors
    $visitStmt = $pdo->query("SELECT SUM(hits) as total_visitors FROM visitor_stats");
    $visitors = $visitStmt->fetch()['total_visitors'];
    $visitors = $visitors ? intval($visitors) : 0;

    // Total Events
    $eventStmt = $pdo->query("SELECT COUNT(*) as total_events FROM events");
    $events = intval($eventStmt->fetch()['total_events']);

    // Total Gallery Images
    $galleryStmt = $pdo->query("SELECT COUNT(*) as total_gallery FROM gallery WHERE media_type = 'image'");
    $gallery = intval($galleryStmt->fetch()['total_gallery']);

    // Total Sponsors
    $sponsorStmt = $pdo->query("SELECT COUNT(*) as total_sponsors FROM sponsors");
    $sponsors = intval($sponsorStmt->fetch()['total_sponsors']);

    // Total Volunteers
    $volunteerStmt = $pdo->query("SELECT COUNT(*) as total_volunteers FROM volunteers");
    $volunteers = intval($volunteerStmt->fetch()['total_volunteers']);

    // Recent volunteers registrations
    $recentVolStmt = $pdo->query("SELECT id, name, mobile, email, status, created_at FROM volunteers ORDER BY created_at DESC LIMIT 5");
    $recentVolunteers = $recentVolStmt->fetchAll();

    // Recent contact messages
    $recentMsgStmt = $pdo->query("SELECT id, name, email, subject, reply_status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5");
    $recentMessages = $recentMsgStmt->fetchAll();

    // Latest News
    $newsStmt = $pdo->query("SELECT id, title, category, publish_date FROM news ORDER BY publish_date DESC LIMIT 5");
    $latestNews = $newsStmt->fetchAll();

    // Compile recent activities log dynamically
    $activities = [];
    foreach ($recentVolunteers as $rv) {
        $activities[] = [
            'type' => 'volunteer',
            'title' => "New Volunteer application from " . htmlspecialchars($rv['name']),
            'time' => $rv['created_at'],
            'status' => $rv['status']
        ];
    }
    foreach ($recentMessages as $rm) {
        $activities[] = [
            'type' => 'message',
            'title' => "Received contact message from " . htmlspecialchars($rm['name']),
            'time' => $rm['created_at'],
            'status' => $rm['reply_status']
        ];
    }
    
    // Sort activities by time descending
    usort($activities, function($a, $b) {
        return strcmp($b['time'], $a['time']);
    });
    $activities = array_slice($activities, 0, 8); // take top 8

    sendResponse(true, "Dashboard stats fetched successfully", [
        'stats' => [
            'visitors' => $visitors,
            'total_hits' => $visitors,
            'events' => $events,
            'total_events' => $events,
            'gallery' => $gallery,
            'total_gallery' => $gallery,
            'sponsors' => $sponsors,
            'total_sponsors' => $sponsors,
            'volunteers' => $volunteers,
            'total_volunteers' => $volunteers
        ],
        'recentVolunteers' => $recentVolunteers,
        'latest_volunteers' => $recentVolunteers,
        'recentMessages' => $recentMessages,
        'latest_messages' => $recentMessages,
        'latestNews' => $latestNews,
        'activities' => $activities
    ]);

} catch (\PDOException $e) {
    sendResponse(false, "Failed to compile dashboard metrics: " . $e->getMessage(), null, 500);
}
