<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'GET') {
    if ($action === 'check') {
        $user = get_auth_user();
        if ($user) {
            json_response(true, 'User is authenticated', ['user' => $user]);
        }
        json_response(false, 'User is not authenticated', null, 401);
    } elseif ($action === 'logout') {
        json_response(true, 'Logged out successfully', null);
    }
}

if ($method === 'POST') {
    $body = get_body();

    if ($action === 'login' || isset($body['username'])) {
        $username = isset($body['username']) ? trim($body['username']) : '';
        $password = isset($body['password']) ? trim($body['password']) : '';

        if (empty($username) || empty($password)) {
            json_response(false, 'Username and password are required', null, 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $userData = [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role']
            ];
            $token = generate_token($user);

            json_response(true, 'Login successful', [
                'token' => $token,
                'user' => $userData
            ]);
        }

        json_response(false, 'Invalid username or password', null, 401);
    }

    if ($action === 'forgot-password') {
        $email = isset($body['email']) ? trim($body['email']) : '';
        if (empty($email)) {
            json_response(false, 'Email address is required', null, 400);
        }

        $stmt = $pdo->prepare("SELECT id, username FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            $resetToken = bin2hex(random_bytes(16));
            $expires = date('Y-m-d H:i:s', time() + 3600);

            $pdo->prepare("UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?")
                ->execute([$resetToken, $expires, $user['id']]);

            json_response(true, 'Password reset token generated.', [
                'reset_token' => $resetToken,
                'email' => $email
            ]);
        }

        json_response(false, 'No account associated with this email address', null, 404);
    }

    if ($action === 'reset-password') {
        $token = isset($body['token']) ? trim($body['token']) : '';
        $password = isset($body['password']) ? trim($body['password']) : '';

        if (empty($token) || empty($password)) {
            json_response(false, 'Reset token and new password are required', null, 400);
        }

        $stmt = $pdo->prepare("SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > CURRENT_TIMESTAMP");
        $stmt->execute([$token]);
        $user = $stmt->fetch();

        if ($user) {
            $hashed = password_hash($password, PASSWORD_DEFAULT);
            $pdo->prepare("UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?")
                ->execute([$hashed, $user['id']]);

            json_response(true, 'Password reset successful. You can now log in with your new password.', null);
        }

        json_response(false, 'Invalid or expired password reset token', null, 400);
    }

    if ($action === 'change-password') {
        $authUser = get_auth_user();
        if (!$authUser) {
            json_response(false, 'Unauthorized', null, 401);
        }

        $old_password = isset($body['old_password']) ? trim($body['old_password']) : '';
        $new_password = isset($body['new_password']) ? trim($body['new_password']) : '';

        if (empty($old_password) || empty($new_password)) {
            json_response(false, 'Old password and new password are required', null, 400);
        }

        $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE id = ?");
        $stmt->execute([$authUser['user_id']]);
        $user = $stmt->fetch();

        if ($user && password_verify($old_password, $user['password_hash'])) {
            $hashed = password_hash($new_password, PASSWORD_DEFAULT);
            $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?")
                ->execute([$hashed, $authUser['user_id']]);

            json_response(true, 'Password changed successfully', null);
        }

        json_response(false, 'Incorrect old password', null, 400);
    }
}

json_response(false, 'Invalid auth endpoint request', null, 400);
