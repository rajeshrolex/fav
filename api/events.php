<?php
// api/events.php — Events CRUD router
require_once __DIR__ . '/../config/config.php';

$action = getAction();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET: List all events or single event ─────────────────────────────────────
if ($method === 'GET') {
    if ($action === 'registrations') {
        requireAuth();
        $db   = getDB();
        $stmt = $db->query(
            'SELECT r.*, e.title as event_title FROM event_registrations r 
             JOIN events e ON r.event_id = e.id ORDER BY r.created_at DESC'
        );
        $rows = $stmt->fetchAll();
        json_success('Registrations fetched successfully', $rows);
    }

    $id = sanitizeInt($_GET['id'] ?? 0);
    $db = getDB();

    if ($id > 0) {
        // Single event with gallery
        $stmt = $db->prepare('SELECT * FROM events WHERE id = ?');
        $stmt->execute([$id]);
        $event = $stmt->fetch();

        if (!$event) {
            json_not_found('Event not found');
        }

        $gStmt = $db->prepare('SELECT * FROM event_gallery WHERE event_id = ?');
        $gStmt->execute([$id]);
        $event['gallery'] = $gStmt->fetchAll();
        $event = formatEvent($event);

        json_success('Event details fetched', $event);
    }

    // All events
    $isAdmin = isAdmin();
    $sql     = 'SELECT * FROM events';
    if (!$isAdmin) {
        $sql .= " WHERE status != 'Cancelled'";
    }
    $sql .= ' ORDER BY event_date DESC, id DESC';

    $rows      = $db->query($sql)->fetchAll();
    $formatted = array_map('formatEvent', $rows);
    json_success('Events list fetched successfully', $formatted);
}

// ── POST: Add / Edit / Delete / Register ─────────────────────────────────────
if ($method === 'POST') {
    $body = getRequestBody();

    if ($action === 'delete') {
        requireAuth();
        $id = sanitizeInt($body['id'] ?? 0);
        if (!$id) json_error('Event ID is required');
        $db   = getDB();
        $stmt = $db->prepare('DELETE FROM events WHERE id = ?');
        $stmt->execute([$id]);
        json_success('Event deleted successfully');
    }

    if ($action === 'register') {
        // Public: register for an event
        $err = requireFields($body, ['event_id', 'name', 'email', 'phone']);
        if ($err) json_error($err);

        $eventId = sanitizeInt($body['event_id']);
        $tickets = max(1, sanitizeInt($body['tickets'] ?? 1));

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'INSERT INTO event_registrations (event_id, name, email, phone, tickets) VALUES (?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $eventId,
                sanitize($body['name']),
                sanitize($body['email']),
                sanitize($body['phone']),
                $tickets,
            ]);
            json_success('Successfully registered for this event!', ['id' => $db->lastInsertId()]);
        } catch (PDOException $e) {
            json_server_error('Failed to register: ' . $e->getMessage());
        }
    }

    if ($action === 'add') {
        requireAuth();
        $err = requireFields($body, ['title', 'description', 'event_date', 'event_time', 'venue']);
        if ($err) json_error($err);

        try {
            $db   = getDB();
            $stmt = $db->prepare(
                'INSERT INTO events 
                 (title, description, event_date, event_time, venue, category, cover_image, registration_link, status, is_featured) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                sanitize($body['title']),
                sanitize($body['description'], true),
                sanitize($body['event_date']),
                sanitize($body['event_time']),
                sanitize($body['venue']),
                sanitize($body['category'] ?? 'General'),
                sanitize($body['cover_image'] ?? ''),
                sanitize($body['registration_link'] ?? ''),
                sanitize($body['status'] ?? 'Upcoming'),
                isset($body['is_featured']) && $body['is_featured'] ? 1 : 0,
            ]);
            $eventId = (int) $db->lastInsertId();

            // Insert gallery images
            saveEventGallery($db, $eventId, $body['gallery'] ?? []);

            json_success('Event created successfully', ['id' => $eventId]);
        } catch (PDOException $e) {
            json_server_error('Failed to create event: ' . $e->getMessage());
        }
    }

    if ($action === 'edit') {
        requireAuth();
        $id  = sanitizeInt($body['id'] ?? 0);
        $err = requireFields($body, ['id', 'title', 'description', 'event_date', 'event_time', 'venue']);
        if ($err) json_error($err);
        if (!$id) json_error('Event ID is required');

        try {
            $db = getDB();
            $db->beginTransaction();

            $stmt = $db->prepare(
                'UPDATE events SET 
                 title = ?, description = ?, event_date = ?, event_time = ?, venue = ?, 
                 category = ?, cover_image = ?, registration_link = ?, status = ?, is_featured = ? 
                 WHERE id = ?'
            );
            $stmt->execute([
                sanitize($body['title']),
                sanitize($body['description'], true),
                sanitize($body['event_date']),
                sanitize($body['event_time']),
                sanitize($body['venue']),
                sanitize($body['category'] ?? 'General'),
                sanitize($body['cover_image'] ?? ''),
                sanitize($body['registration_link'] ?? ''),
                sanitize($body['status'] ?? 'Upcoming'),
                isset($body['is_featured']) && $body['is_featured'] ? 1 : 0,
                $id,
            ]);

            // Rebuild gallery
            if (isset($body['gallery']) && is_array($body['gallery'])) {
                $del = $db->prepare('DELETE FROM event_gallery WHERE event_id = ?');
                $del->execute([$id]);
                saveEventGallery($db, $id, $body['gallery']);
            }

            $db->commit();
            json_success('Event updated successfully');
        } catch (PDOException $e) {
            $db->rollBack();
            json_server_error('Failed to update event: ' . $e->getMessage());
        }
    }
}

json_error('Invalid request', 400);

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatEvent(array $e): array {
    $e['date']      = $e['event_date']  ?? '';
    $e['time']      = $e['event_time']  ?? '';
    $e['location']  = $e['venue']       ?? '';
    $e['image']     = $e['cover_image'] ?? '';
    $e['image_url'] = $e['cover_image'] ?? '';
    return $e;
}

function saveEventGallery(PDO $db, int $eventId, array $gallery): void {
    $ins = $db->prepare('INSERT INTO event_gallery (event_id, image_url) VALUES (?, ?)');
    foreach ($gallery as $url) {
        $url = is_string($url) ? trim($url) : '';
        if ($url !== '') {
            $ins->execute([$eventId, $url]);
        }
    }
}
