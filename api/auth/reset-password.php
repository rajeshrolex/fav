<?php
// api/auth/reset-password.php
require_once __DIR__ . '/../../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}

$body     = getRequestBody();
$token    = sanitize($body['token'] ?? '');
$password = $body['password'] ?? '';

if ($token === '' || $password === '') {
    json_error('Reset token and new password are required');
}

if (strlen($password) < 6) {
    json_error('Password must be at least 6 characters');
}

try {
    $db   = getDB();
    $stmt = $db->prepare('SELECT id, reset_token_expires FROM users WHERE reset_token = ? LIMIT 1');
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if ($user) {
        $expiry = strtotime($user['reset_token_expires']);
        if ($expiry > time()) {
            $hashed = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
            $upd    = $db->prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?');
            $upd->execute([$hashed, $user['id']]);
            json_success('Password reset successful. You can now log in with your new password.');
        }
    }

    json_error('Invalid or expired password reset token', 400);

} catch (PDOException $e) {
    json_server_error('Reset password failed: ' . $e->getMessage());
}
