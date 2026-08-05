<?php
// api/auth/login.php
require_once __DIR__ . '/../../config/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}

$body = getRequestBody();
$username = sanitize($body['username'] ?? '');
$password = $body['password'] ?? '';

if ($username === '' || $password === '') {
    json_error('Username and password are required');
}

try {
    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1');
    $stmt->execute([$username, $username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        // Regenerate session ID to prevent session fixation
        session_regenerate_id(true);

        $userData = [
            'id'       => (int) $user['id'],
            'username' => $user['username'],
            'email'    => $user['email'],
            'role'     => $user['role'],
        ];

        // Store in session
        $_SESSION['admin']       = $userData;
        $_SESSION['admin_token'] = bin2hex(random_bytes(32));

        json_success('Login successful', [
            'token' => $_SESSION['admin_token'],
            'user'  => $userData,
        ]);
    }

    json_error('Invalid username or password', 401);

} catch (PDOException $e) {
    json_server_error('Login failed: ' . $e->getMessage());
}
