<?php
// api/auth/change-password.php
require_once __DIR__ . '/../../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}

$authUser    = requireAuth();
$body        = getRequestBody();
$oldPassword = $body['old_password'] ?? '';
$newPassword = $body['new_password'] ?? '';

if ($oldPassword === '' || $newPassword === '') {
    json_error('Old password and new password are required');
}

if (strlen($newPassword) < 6) {
    json_error('New password must be at least 6 characters');
}

try {
    $db   = getDB();
    $stmt = $db->prepare('SELECT password_hash FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$authUser['id']]);
    $user = $stmt->fetch();

    if ($user && password_verify($oldPassword, $user['password_hash'])) {
        $hashed = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        $upd    = $db->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
        $upd->execute([$hashed, $authUser['id']]);
        json_success('Password changed successfully');
    }

    json_error('Incorrect old password', 400);

} catch (PDOException $e) {
    json_server_error('Password update failed: ' . $e->getMessage());
}
