<?php
// api/auth/check.php — Verify current session / token
require_once __DIR__ . '/../../config/config.php';

$user = getAuthUser();
if ($user) {
    json_success('User is authenticated', ['user' => $user]);
}
json_error('User is not authenticated', 401);
