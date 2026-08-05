<?php
// helpers/validation.php — Input validation utilities

/**
 * Validate that required fields are present and non-empty.
 * Returns error message string, or null if all good.
 */
function requireFields(array $data, array $fields): ?string {
    foreach ($fields as $field) {
        $val = $data[$field] ?? null;
        if ($val === null || $val === '' || (is_string($val) && trim($val) === '')) {
            $label = ucfirst(str_replace('_', ' ', $field));
            return "{$label} is required";
        }
    }
    return null;
}

/**
 * Sanitize a string value — trim + strip tags.
 */
function sanitize(?string $val, bool $allowHtml = false): string {
    if ($val === null) return '';
    $val = trim($val);
    if (!$allowHtml) {
        $val = strip_tags($val);
    }
    return $val;
}

/**
 * Validate and sanitize an integer.
 */
function sanitizeInt($val, int $default = 0): int {
    return (int) filter_var($val, FILTER_SANITIZE_NUMBER_INT) ?: $default;
}

/**
 * Validate email address.
 */
function isValidEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate URL.
 */
function isValidUrl(string $url): bool {
    return filter_var($url, FILTER_VALIDATE_URL) !== false;
}

/**
 * Generate a URL-friendly slug from a string.
 */
function makeSlug(string $text): string {
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', $text);
    $text = trim($text, '-');
    return $text;
}
