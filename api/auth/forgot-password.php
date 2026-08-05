<?php
// api/auth/forgot-password.php
require_once __DIR__ . '/../../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}

$body  = getRequestBody();
$email = sanitize($body['email'] ?? '');

if ($email === '' || !isValidEmail($email)) {
    json_error('A valid email address is required');
}

try {
    $db   = getDB();
    $stmt = $db->prepare('SELECT id, username FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        $resetToken = bin2hex(random_bytes(20));
        $expires    = date('Y-m-d H:i:s', time() + 3600); // 1 hour

        $upd = $db->prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?');
        $upd->execute([$resetToken, $expires, $user['id']]);

        json_success('Password reset token generated.', [
            'reset_token' => $resetToken,
            'email'       => $email,
        ]);
    }

    json_error('No account associated with this email address', 404);

} catch (PDOException $e) {
    json_server_error('Error initiating password reset: ' . $e->getMessage());
}
