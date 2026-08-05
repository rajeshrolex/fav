<?php
// helpers/response.php — Standardized JSON response helpers

function json_success(string $message = 'Success', $data = null, int $code = 200): void {
    http_response_code($code);
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data'    => $data
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error(string $message = 'An error occurred', int $code = 400, $data = null): void {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'message' => $message,
        'data'    => $data
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_not_found(string $message = 'Resource not found'): void {
    json_error($message, 404);
}

function json_unauthorized(string $message = 'Authentication required'): void {
    json_error($message, 401);
}

function json_forbidden(string $message = 'Access denied: Insufficient permissions'): void {
    json_error($message, 403);
}

function json_server_error(string $message = 'Internal server error'): void {
    json_error($message, 500);
}
