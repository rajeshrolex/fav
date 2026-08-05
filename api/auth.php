<?php
// api/auth.php — Main auth router (matches frontend calls: /api/auth.php?action=...)
require_once __DIR__ . '/../config/config.php';

$action = getAction();
$method = $_SERVER['REQUEST_METHOD'];

switch ($action) {
    case 'login':
        require __DIR__ . '/auth/login.php';
        break;

    case 'logout':
        require __DIR__ . '/auth/logout.php';
        break;

    case 'check':
        require __DIR__ . '/auth/check.php';
        break;

    case 'forgot-password':
        require __DIR__ . '/auth/forgot-password.php';
        break;

    case 'reset-password':
        require __DIR__ . '/auth/reset-password.php';
        break;

    case 'change-password':
        require __DIR__ . '/auth/change-password.php';
        break;

    default:
        // No action = check auth status
        require __DIR__ . '/auth/check.php';
        break;
}
