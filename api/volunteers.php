<?php
// api/volunteers.php
require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Retrieve volunteers (Admin only)
        $user = requireAuth();

        if ($action === 'csv') {
            // Export CSV
            try {
                $stmt = $pdo->query("SELECT name, mobile, email, address, skills, status, created_at FROM volunteers ORDER BY created_at DESC");
                $volunteers = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Set headers for download
                header('Content-Type: text/csv; charset=utf-8');
                header('Content-Disposition: attachment; filename=volunteers_export_' . date('Y-m-d') . '.csv');
                
                $output = fopen('php://output', 'w');
                
                // Write CSV headers
                fputcsv($output, ['Name', 'Mobile', 'Email', 'Address', 'Skills/Department', 'Status', 'Registration Date']);
                
                // Write data rows
                foreach ($volunteers as $v) {
                    fputcsv($output, [
                        $v['name'],
                        $v['mobile'],
                        $v['email'],
                        $v['address'],
                        $v['skills'],
                        $v['status'],
                        $v['created_at']
                    ]);
                }
                fclose($output);
                exit();
            } catch (\PDOException $e) {
                http_response_code(500);
                echo "Error exporting CSV: " . $e->getMessage();
                exit();
            }
        } else {
            // General query
            try {
                $status = isset($_GET['status']) ? trim($_GET['status']) : '';
                $search = isset($_GET['search']) ? trim($_GET['search']) : '';
                
                $query = "SELECT * FROM volunteers WHERE 1=1";
                $params = [];

                if (!empty($status)) {
                    $query .= " AND status = ?";
                    $params[] = $status;
                }
                if (!empty($search)) {
                    $query .= " AND (name LIKE ? OR email LIKE ? OR mobile LIKE ? OR skills LIKE ?)";
                    $params[] = "%$search%";
                    $params[] = "%$search%";
                    $params[] = "%$search%";
                    $params[] = "%$search%";
                }

                $query .= " ORDER BY created_at DESC";
                $stmt = $pdo->prepare($query);
                $stmt->execute($params);
                $volunteers = $stmt->fetchAll();
                
                sendResponse(true, "Volunteers list fetched successfully", $volunteers);
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to fetch volunteers: " . $e->getMessage(), null, 500);
            }
        }
        break;

    case 'POST':
        if ($action === 'register') {
            // Public volunteer registration
            $input = json_decode(file_get_contents('php://input'), true);
            $name = isset($input['name']) ? trim($input['name']) : '';
            $mobile = isset($input['mobile']) ? trim($input['mobile']) : '';
            $email = isset($input['email']) ? trim($input['email']) : '';

            if (empty($name) || empty($mobile) || empty($email)) {
                sendResponse(false, "Name, mobile number, and email address are required", null, 400);
            }

            try {
                // Check if already registered
                $check = $pdo->prepare("SELECT id FROM volunteers WHERE email = ? AND status = 'Pending'");
                $check->execute([$email]);
                if ($check->fetch()) {
                    sendResponse(false, "You already have a pending registration request.", null, 409);
                }

                $stmt = $pdo->prepare("INSERT INTO volunteers (name, mobile, email, address, skills, status) VALUES (?, ?, ?, ?, ?, 'Pending')");
                $stmt->execute([
                    $name,
                    $mobile,
                    $email,
                    isset($input['address']) ? trim($input['address']) : null,
                    isset($input['skills']) ? trim($input['skills']) : null
                ]);
                sendResponse(true, "Thank you! Your volunteer application has been submitted successfully and is pending approval.");
            } catch (\PDOException $e) {
                sendResponse(false, "Failed to submit registration: " . $e->getMessage(), null, 500);
            }
        } 
        else {
            // Admin only actions
            $user = requireAuth(['Super Admin', 'Admin']);
            $input = json_decode(file_get_contents('php://input'), true);

            if ($action === 'status') {
                $id = isset($input['id']) ? intval($input['id']) : 0;
                $status = isset($input['status']) ? trim($input['status']) : '';

                if (!$id || !in_array($status, ['Pending', 'Approved', 'Rejected'])) {
                    sendResponse(false, "Valid volunteer ID and status (Pending/Approved/Rejected) are required", null, 400);
                }

                try {
                    $stmt = $pdo->prepare("UPDATE volunteers SET status = ? WHERE id = ?");
                    $stmt->execute([$status, $id]);
                    sendResponse(true, "Volunteer application status updated to $status successfully");
                } catch (\PDOException $e) {
                    sendResponse(false, "Failed to update volunteer status: " . $e->getMessage(), null, 500);
                }
            } 
            elseif ($action === 'delete') {
                $id = isset($input['id']) ? intval($input['id']) : 0;
                if (!$id) {
                    sendResponse(false, "Volunteer ID is required", null, 400);
                }

                try {
                    $stmt = $pdo->prepare("DELETE FROM volunteers WHERE id = ?");
                    $stmt->execute([$id]);
                    sendResponse(true, "Volunteer record deleted successfully");
                } catch (\PDOException $e) {
                    sendResponse(false, "Failed to delete volunteer: " . $e->getMessage(), null, 500);
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
