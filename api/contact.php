<?php
// api/contact.php
require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if ($action === 'messages') {
            // Retrieve contact messages (Admin only)
            $user = requireAuth();
            try {
                $status = isset($_GET['status']) ? trim($_GET['status']) : '';
                $query = "SELECT * FROM contact_messages";
                $params = [];
                
                if (!empty($status)) {
                    $query .= " WHERE reply_status = ?";
                    $params[] = $status;
                }
                $query .= " ORDER BY created_at DESC";
                
                $stmt = $pdo->prepare($query);
                $stmt->execute($params);
                $messages = $stmt->fetchAll();
                sendResponse(true, "Inbox messages fetched successfully", $messages);
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to fetch inbox: " . $e->getMessage(), null, 500);
            }
        } else {
            // Fetch contact details (Public / Admin)
            try {
                $keys = [
                    'contact_address', 'contact_phone', 'contact_email', 'google_map_iframe',
                    'social_facebook', 'social_twitter', 'social_instagram', 'social_youtube', 'social_linkedin'
                ];
                $inQuery = implode(',', array_fill(0, count($keys), '?'));
                $stmt = $pdo->prepare("SELECT * FROM settings WHERE key_name IN ($inQuery)");
                $stmt->execute($keys);
                $rows = $stmt->fetchAll();
                
                $details = [];
                foreach ($keys as $k) {
                    $details[$k] = '';
                }
                foreach ($rows as $row) {
                    $details[$row['key_name']] = $row['key_value'];
                }
                sendResponse(true, "Contact details loaded successfully", $details);
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to load contact info: " . $e->getMessage(), null, 500);
            }
        }
        break;

    case 'POST':
        if ($action === 'send') {
            // Public message submission
            $input = json_decode(file_get_contents('php://input'), true);
            $name = isset($input['name']) ? trim($input['name']) : '';
            $email = isset($input['email']) ? trim($input['email']) : '';
            $message = isset($input['message']) ? trim($input['message']) : '';

            if (empty($name) || empty($email) || empty($message)) {
                sendResponse(false, "Name, email, and message are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, subject, message, reply_status) VALUES (?, ?, ?, ?, 'Unread')");
                $stmt->execute([
                    $name,
                    $email,
                    isset($input['subject']) ? trim($input['subject']) : null,
                    $message
                ]);
                sendResponse(true, "Your message has been sent successfully. We will get back to you shortly.");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to send message: " . $e->getMessage(), null, 500);
            }
        } 
        else {
            // Admin only actions
            $user = requireAuth(['Super Admin', 'Admin']);
            $input = json_decode(file_get_contents('php://input'), true);

            if ($action === 'status') {
                $id = isset($input['id']) ? intval($input['id']) : 0;
                $status = isset($input['reply_status']) ? trim($input['reply_status']) : '';

                if (!$id || !in_array($status, ['Unread', 'Read', 'Replied'])) {
                    sendResponse(false, "Valid message ID and status (Unread/Read/Replied) are required", null, 400);
                }

                try {
                    $stmt = $pdo->prepare("UPDATE contact_messages SET reply_status = ? WHERE id = ?");
                    $stmt->execute([$status, $id]);
                    sendResponse(true, "Message status updated successfully");
                } catch (\PDOException $e) {
                    sendResponse(false, "Failed to update status: " . $e->getMessage(), null, 500);
                }
            } 
            elseif ($action === 'delete') {
                $id = isset($input['id']) ? intval($input['id']) : 0;
                if (!$id) {
                    sendResponse(false, "Message ID is required", null, 400);
                }

                try {
                    $stmt = $pdo->prepare("DELETE FROM contact_messages WHERE id = ?");
                    $stmt->execute([$id]);
                    sendResponse(true, "Message deleted from inbox successfully");
                } catch (\PDOException $e) {
                    sendResponse(false, "Failed to delete message: " . $e->getMessage(), null, 500);
                }
            } 
            else {
                sendResponse(false, "Invalid POST action", null, 400);
            }
        }
        break;

    default:
        sendResponse(false, "Request method not supported", null, 405);
        break;
}
