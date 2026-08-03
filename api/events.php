<?php
// api/events.php
require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if ($action === 'registrations') {
            $user = requireAuth(['Super Admin', 'Admin', 'Editor']);
            try {
                $stmt = $pdo->query("SELECT r.*, e.title as event_title FROM event_registrations r JOIN events e ON r.event_id = e.id ORDER BY r.created_at DESC");
                $registrations = $stmt->fetchAll();
                sendResponse(true, "Registrations fetched successfully", $registrations);
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to fetch registrations: " . $e->getMessage(), null, 500);
            }
        }

        // Retrieve events
        try {
            $user = getAuthUser();
            $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

            if ($id > 0) {
                // Fetch single event with its gallery images
                $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
                $stmt->execute([$id]);
                $event = $stmt->fetch();

                if ($event) {
                    $galStmt = $pdo->prepare("SELECT * FROM event_gallery WHERE event_id = ?");
                    $galStmt->execute([$id]);
                    $event['gallery'] = $galStmt->fetchAll();
                    sendResponse(true, "Event details fetched", $event);
                } else {
                    sendResponse(false, "Event not found", null, 404);
                }
            } else {
                // Fetch all events
                $query = "SELECT * FROM events";
                $params = [];

                if (!$user) {
                    // Public users see non-cancelled events
                    $query .= " WHERE status != 'Cancelled'";
                }

                // Sorting
                $query .= " ORDER BY event_date DESC, id DESC";
                
                $stmt = $pdo->prepare($query);
                $stmt->execute($params);
                $events = $stmt->fetchAll();
                sendResponse(true, "Events list fetched successfully", $events);
            }
        } catch (\PDOException $e) {
            sendResponse(false, "Failed to fetch events: " . $e->getMessage(), null, 500);
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        if ($action === 'register') {
            $eventId = isset($input['event_id']) ? intval($input['event_id']) : 0;
            $name = isset($input['name']) ? trim($input['name']) : '';
            $email = isset($input['email']) ? trim($input['email']) : '';
            $phone = isset($input['phone']) ? trim($input['phone']) : '';
            $tickets = isset($input['tickets']) ? intval($input['tickets']) : 1;

            if (!$eventId || empty($name) || empty($email) || empty($phone)) {
                sendResponse(false, "Event ID, Name, Email, and Phone are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("INSERT INTO event_registrations (event_id, name, email, phone, tickets) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$eventId, $name, $email, $phone, $tickets]);
                sendResponse(true, "Successfully registered for this event!");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to register for event: " . $e->getMessage(), null, 500);
            }
        }

        $user = requireAuth(['Super Admin', 'Admin', 'Editor']);

        if ($action === 'add') {
            $title = isset($input['title']) ? trim($input['title']) : '';
            $description = isset($input['description']) ? trim($input['description']) : '';
            $eventDate = isset($input['event_date']) ? trim($input['event_date']) : '';
            $eventTime = isset($input['event_time']) ? trim($input['event_time']) : '';
            $venue = isset($input['venue']) ? trim($input['venue']) : '';

            if (empty($title) || empty($description) || empty($eventDate) || empty($eventTime) || empty($venue)) {
                sendResponse(false, "Title, description, date, time, and venue are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("INSERT INTO events 
                    (title, description, event_date, event_time, venue, cover_image, registration_link, status, is_featured) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $title,
                    $description,
                    $eventDate,
                    $eventTime,
                    $venue,
                    isset($input['cover_image']) ? trim($input['cover_image']) : null,
                    isset($input['registration_link']) ? trim($input['registration_link']) : null,
                    isset($input['status']) ? trim($input['status']) : 'Upcoming',
                    isset($input['is_featured']) ? intval($input['is_featured']) : 0
                ]);
                $eventId = $pdo->lastInsertId();

                // Save event gallery images if provided
                if (isset($input['gallery']) && is_array($input['gallery'])) {
                    $galStmt = $pdo->prepare("INSERT INTO event_gallery (event_id, image_url) VALUES (?, ?)");
                    foreach ($input['gallery'] as $imgUrl) {
                        if (!empty($imgUrl)) {
                            $galStmt->execute([$eventId, trim($imgUrl)]);
                        }
                    }
                }

                sendResponse(true, "Event created successfully", ['id' => $eventId]);
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to create event: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'edit') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            $title = isset($input['title']) ? trim($input['title']) : '';
            $description = isset($input['description']) ? trim($input['description']) : '';
            $eventDate = isset($input['event_date']) ? trim($input['event_date']) : '';
            $eventTime = isset($input['event_time']) ? trim($input['event_time']) : '';
            $venue = isset($input['venue']) ? trim($input['venue']) : '';

            if (!$id || empty($title) || empty($description) || empty($eventDate) || empty($eventTime) || empty($venue)) {
                sendResponse(false, "ID, Title, description, date, time, and venue are required", null, 400);
            }

            try {
                $pdo->beginTransaction();

                $stmt = $pdo->prepare("UPDATE events SET 
                    title = ?, description = ?, event_date = ?, event_time = ?, 
                    venue = ?, cover_image = ?, registration_link = ?, status = ?, is_featured = ? 
                    WHERE id = ?");
                $stmt->execute([
                    $title,
                    $description,
                    $eventDate,
                    $eventTime,
                    $venue,
                    isset($input['cover_image']) ? trim($input['cover_image']) : null,
                    isset($input['registration_link']) ? trim($input['registration_link']) : null,
                    isset($input['status']) ? trim($input['status']) : 'Upcoming',
                    isset($input['is_featured']) ? intval($input['is_featured']) : 0,
                    $id
                ]);

                // Sync event gallery
                if (isset($input['gallery']) && is_array($input['gallery'])) {
                    // Remove old gallery
                    $delStmt = $pdo->prepare("DELETE FROM event_gallery WHERE event_id = ?");
                    $delStmt->execute([$id]);

                    // Add new gallery items
                    $galStmt = $pdo->prepare("INSERT INTO event_gallery (event_id, image_url) VALUES (?, ?)");
                    foreach ($input['gallery'] as $imgUrl) {
                        if (!empty($imgUrl)) {
                            $galStmt->execute([$id, trim($imgUrl)]);
                        }
                    }
                }

                $pdo->commit();
                sendResponse(true, "Event updated successfully");
            } catch (\Exception $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                sendResponse(false, "Failed to update event: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'delete') {
            $id = isset($input['id']) ? intval($input['id']) : 0;
            if (!$id) {
                sendResponse(false, "Event ID is required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("DELETE FROM events WHERE id = ?");
                $stmt->execute([$id]);
                sendResponse(true, "Event deleted successfully");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to delete event: " . $e->getMessage(), null, 500);
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
