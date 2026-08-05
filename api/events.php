<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($method === 'GET') {
    if ($action === 'registrations') {
        $authUser = get_auth_user();
        if (!$authUser) {
            json_response(false, 'Unauthorized', null, 401);
        }
        $stmt = $pdo->query("SELECT r.*, e.title as event_title FROM event_registrations r JOIN events e ON r.event_id = e.id ORDER BY r.created_at DESC");
        $rows = $stmt->fetchAll();
        json_response(true, 'Registrations fetched successfully', $rows);
    }

    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
        $stmt->execute([$id]);
        $event = $stmt->fetch();
        if (!$event) {
            json_response(false, 'Event not found', null, 404);
        }

        $galStmt = $pdo->prepare("SELECT * FROM event_gallery WHERE event_id = ?");
        $galStmt->execute([$id]);
        $event['gallery'] = $galStmt->fetchAll();

        $event['date'] = $event['event_date'];
        $event['time'] = $event['event_time'];
        $event['location'] = $event['venue'];
        $event['image'] = $event['cover_image'];
        $event['image_url'] = $event['cover_image'];

        json_response(true, 'Event details fetched', $event);
    }

    $authUser = get_auth_user();
    $sql = "SELECT * FROM events";
    if (!$authUser) {
        $sql .= " WHERE status != 'Cancelled'";
    }
    $sql .= " ORDER BY event_date DESC, id DESC";

    $stmt = $pdo->query($sql);
    $events = $stmt->fetchAll();

    $formatted = array_map(function($e) {
        $e['date'] = $e['event_date'];
        $e['time'] = $e['event_time'];
        $e['location'] = $e['venue'];
        $e['image'] = $e['cover_image'];
        $e['image_url'] = $e['cover_image'];
        return $e;
    }, $events);

    json_response(true, 'Events list fetched successfully', $formatted);
}

if ($method === 'POST') {
    $body = get_body();

    if ($action === 'register') {
        $event_id = isset($body['event_id']) ? intval($body['event_id']) : 0;
        $name = isset($body['name']) ? trim($body['name']) : '';
        $email = isset($body['email']) ? trim($body['email']) : '';
        $phone = isset($body['phone']) ? trim($body['phone']) : '';
        $tickets = isset($body['tickets']) ? intval($body['tickets']) : 1;

        if (!$event_id || empty($name) || empty($email) || empty($phone)) {
            json_response(false, 'Event ID, Name, Email, and Phone are required', null, 400);
        }

        $stmt = $pdo->prepare("INSERT INTO event_registrations (event_id, name, email, phone, tickets) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$event_id, $name, $email, $phone, $tickets]);

        json_response(true, 'Successfully registered for this event!', null);
    }

    $authUser = get_auth_user();
    if (!$authUser) {
        json_response(false, 'Unauthorized', null, 401);
    }

    if ($action === 'add' || (!isset($body['id']) && $action !== 'edit' && $action !== 'delete')) {
        $title = isset($body['title']) ? trim($body['title']) : '';
        $description = isset($body['description']) ? trim($body['description']) : '';
        $date = isset($body['event_date']) ? trim($body['event_date']) : (isset($body['date']) ? trim($body['date']) : '');
        $time = isset($body['event_time']) ? trim($body['event_time']) : (isset($body['time']) ? trim($body['time']) : '');
        $venue = isset($body['venue']) ? trim($body['venue']) : (isset($body['location']) ? trim($body['location']) : '');
        $image = isset($body['cover_image']) ? trim($body['cover_image']) : (isset($body['image']) ? trim($body['image']) : '');
        $reg_link = isset($body['registration_link']) ? trim($body['registration_link']) : null;
        $status = isset($body['status']) ? trim($body['status']) : 'Upcoming';
        $is_featured = isset($body['is_featured']) && $body['is_featured'] ? 1 : 0;

        if (empty($title) || empty($description) || empty($date) || empty($time) || empty($venue)) {
            json_response(false, 'Title, description, date, time, and venue are required', null, 400);
        }

        $stmt = $pdo->prepare("INSERT INTO events (title, description, event_date, event_time, venue, cover_image, registration_link, status, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $description, $date, $time, $venue, $image, $reg_link, $status, $is_featured]);
        $eventId = $pdo->lastInsertId();

        if (isset($body['gallery']) && is_array($body['gallery'])) {
            $galStmt = $pdo->prepare("INSERT INTO event_gallery (event_id, image_url) VALUES (?, ?)");
            foreach ($body['gallery'] as $imgUrl) {
                if (!empty($imgUrl)) {
                    $galStmt->execute([$eventId, trim($imgUrl)]);
                }
            }
        }

        json_response(true, 'Event created successfully', ['id' => $eventId]);
    }

    if ($action === 'edit' || (isset($body['id']) && $action !== 'delete')) {
        $eventId = isset($body['id']) ? intval($body['id']) : 0;
        $title = isset($body['title']) ? trim($body['title']) : '';
        $description = isset($body['description']) ? trim($body['description']) : '';
        $date = isset($body['event_date']) ? trim($body['event_date']) : (isset($body['date']) ? trim($body['date']) : '');
        $time = isset($body['event_time']) ? trim($body['event_time']) : (isset($body['time']) ? trim($body['time']) : '');
        $venue = isset($body['venue']) ? trim($body['venue']) : (isset($body['location']) ? trim($body['location']) : '');
        $image = isset($body['cover_image']) ? trim($body['cover_image']) : (isset($body['image']) ? trim($body['image']) : '');
        $reg_link = isset($body['registration_link']) ? trim($body['registration_link']) : null;
        $status = isset($body['status']) ? trim($body['status']) : 'Upcoming';
        $is_featured = isset($body['is_featured']) && $body['is_featured'] ? 1 : 0;

        if (!$eventId || empty($title) || empty($description) || empty($date) || empty($time) || empty($venue)) {
            json_response(false, 'ID, Title, description, date, time, and venue are required', null, 400);
        }

        $stmt = $pdo->prepare("UPDATE events SET title = ?, description = ?, event_date = ?, event_time = ?, venue = ?, cover_image = ?, registration_link = ?, status = ?, is_featured = ? WHERE id = ?");
        $stmt->execute([$title, $description, $date, $time, $venue, $image, $reg_link, $status, $is_featured, $eventId]);

        if (isset($body['gallery']) && is_array($body['gallery'])) {
            $pdo->prepare("DELETE FROM event_gallery WHERE event_id = ?")->execute([$eventId]);
            $galStmt = $pdo->prepare("INSERT INTO event_gallery (event_id, image_url) VALUES (?, ?)");
            foreach ($body['gallery'] as $imgUrl) {
                if (!empty($imgUrl)) {
                    $galStmt->execute([$eventId, trim($imgUrl)]);
                }
            }
        }

        json_response(true, 'Event updated successfully', null);
    }

    if ($action === 'delete') {
        $eventId = isset($body['id']) ? intval($body['id']) : $id;
        if (!$eventId) {
            json_response(false, 'Event ID is required', null, 400);
        }

        $pdo->prepare("DELETE FROM events WHERE id = ?")->execute([$eventId]);
        json_response(true, 'Event deleted successfully', null);
    }
}
