<?php
// api/auth.php
require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        if ($action === 'login') {
            $input = json_decode(file_get_contents('php://input'), true);
            $username = isset($input['username']) ? trim($input['username']) : '';
            $password = isset($input['password']) ? trim($input['password']) : '';

            if (empty($username) || empty($password)) {
                sendResponse(false, "Username and password are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
                $stmt->execute([$username, $username]);
                $user = $stmt->fetch();

                if ($user && password_verify($password, $user['password_hash'])) {
                    // Start PHP Session
                    if (session_status() === PHP_SESSION_NONE) {
                        session_start();
                    }
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['email'] = $user['email'];
                    $_SESSION['role'] = $user['role'];

                    // Generate a lightweight base64 token for React Header use
                    $tokenData = [
                        'user_id' => $user['id'],
                        'username' => $user['username'],
                        'email' => $user['email'],
                        'role' => $user['role'],
                        'expires' => time() + 86400 // 1 day expiry
                    ];
                    $token = base64_encode(json_encode($tokenData));

                    sendResponse(true, "Login successful", [
                        'token' => $token,
                        'user' => [
                            'id' => $user['id'],
                            'username' => $user['username'],
                            'email' => $user['email'],
                            'role' => $user['role']
                        ]
                    ]);
                } else {
                    sendResponse(false, "Invalid username or password", null, 401);
                }
            } catch (\PDOException $e) {
                sendResponse(false, "Login failed: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'forgot-password') {
            $input = json_decode(file_get_contents('php://input'), true);
            $email = isset($input['email']) ? trim($input['email']) : '';

            if (empty($email)) {
                sendResponse(false, "Email address is required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("SELECT id, username FROM users WHERE email = ?");
                $stmt->execute([$email]);
                $user = $stmt->fetch();

                if ($user) {
                    $token = bin2hex(random_bytes(32));
                    $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

                    $updateStmt = $pdo->prepare("UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?");
                    $updateStmt->execute([$token, $expires, $user['id']]);

                    // Since we are running locally without SMTP config, we return the token in API for UI convenience
                    sendResponse(true, "Password reset token generated. In a production environment, this would be sent to your email.", [
                        'reset_token' => $token,
                        'email' => $email
                    ]);
                } else {
                    sendResponse(false, "No account associated with this email address", null, 404);
                }
            } catch (\PDOException $e) {
                sendResponse(false, "Error initiating password reset: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'reset-password') {
            $input = json_decode(file_get_contents('php://input'), true);
            $token = isset($input['token']) ? trim($input['token']) : '';
            $newPassword = isset($input['password']) ? trim($input['password']) : '';

            if (empty($token) || empty($newPassword)) {
                sendResponse(false, "Reset token and new password are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()");
                $stmt->execute([$token]);
                $user = $stmt->fetch();

                if ($user) {
                    $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
                    $updateStmt = $pdo->prepare("UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?");
                    $updateStmt->execute([$hashed, $user['id']]);

                    sendResponse(true, "Password reset successful. You can now log in with your new password.");
                } else {
                    sendResponse(false, "Invalid or expired password reset token", null, 400);
                }
            } catch (\PDOException $e) {
                sendResponse(false, "Reset password failed: " . $e->getMessage(), null, 500);
            }
        } 
        elseif ($action === 'change-password') {
            $user = requireAuth();
            $input = json_decode(file_get_contents('php://input'), true);
            $oldPassword = isset($input['old_password']) ? trim($input['old_password']) : '';
            $newPassword = isset($input['new_password']) ? trim($input['new_password']) : '';

            if (empty($oldPassword) || empty($newPassword)) {
                sendResponse(false, "Old password and new password are required", null, 400);
            }

            try {
                $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE id = ?");
                $stmt->execute([$user['id']]);
                $dbUser = $stmt->fetch();

                if ($dbUser && password_verify($oldPassword, $dbUser['password_hash'])) {
                    $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
                    $updateStmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
                    $updateStmt->execute([$hashed, $user['id']]);

                    sendResponse(true, "Password changed successfully");
                } else {
                    sendResponse(false, "Incorrect old password", null, 400);
                }
            } catch (\PDOException $e) {
                sendResponse(false, "Password update failed: " . $e->getMessage(), null, 500);
            }
        }
        else {
            sendResponse(false, "Invalid POST action", null, 400);
        }
        break;

    case 'GET':
        if ($action === 'check') {
            $user = getAuthUser();
            if ($user) {
                sendResponse(true, "User is authenticated", ['user' => $user]);
            } else {
                sendResponse(false, "User is not authenticated", null, 401);
            }
        } 
        elseif ($action === 'logout') {
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            $_SESSION = array();
            session_destroy();
            sendResponse(true, "Logged out successfully");
        } 
        else {
            sendResponse(false, "Invalid GET action", null, 400);
        }
        break;

    default:
        sendResponse(false, "Request method not supported", null, 405);
        break;
}
