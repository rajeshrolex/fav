<?php
// middleware/auth.php — Session-based authentication middleware

/**
 * Get the currently authenticated admin user from session.
 * Returns user array or null.
 */
function getAuthUser(): ?array {
    if (isset($_SESSION['admin']) && is_array($_SESSION['admin'])) {
        return $_SESSION['admin'];
    }

    // Also accept Bearer token for frontend localStorage compatibility
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
        $token = substr($authHeader, 7);
        $user  = verifyToken($token);
        if ($user) {
            return $user;
        }
    }

    return null;
}

/**
 * Require authentication — calls json_unauthorized() and exits if not authenticated.
 */
function requireAuth(): array {
    $user = getAuthUser();
    if (!$user) {
        json_unauthorized('Authentication required. Please log in.');
    }
    return $user;
}

/**
 * Require authentication with specific role(s).
 */
function requireRole(array $roles = ['Super Admin', 'Admin', 'Editor']): array {
    $user = requireAuth();
    if (!in_array($user['role'] ?? '', $roles, true)) {
        json_forbidden('Access denied: Insufficient permissions');
    }
    return $user;
}

/**
 * Verify a simple token stored in session/localStorage.
 * Supports both our PHP-generated session token and the old Node.js base64 dev token.
 */
function verifyToken(string $token): ?array {
    if (empty($token)) return null;

    // Check stored token in session
    if (isset($_SESSION['admin_token']) && $_SESSION['admin_token'] === $token) {
        return $_SESSION['admin'] ?? null;
    }

    // Try to decode as base64 JSON (dev fallback token from AuthContext.jsx)
    $decoded = @base64_decode($token, true);
    if ($decoded) {
        $data = @json_decode($decoded, true);
        if (is_array($data) && isset($data['username']) && isset($data['expires'])) {
            if ($data['expires'] > (time() * 1000)) {
                return [
                    'id'       => $data['id'] ?? 1,
                    'username' => $data['username'],
                    'email'    => $data['email'] ?? '',
                    'role'     => $data['role'] ?? 'Super Admin',
                ];
            }
        }
    }

    return null;
}

/**
 * Check if the current request is from a logged-in admin (non-blocking).
 */
function isAdmin(): bool {
    return getAuthUser() !== null;
}
