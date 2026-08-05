<?php
// api/media.php — Media Manager (file browser + upload + delete + folder create)
require_once __DIR__ . '/../config/config.php';

requireAuth();

$action = getAction();
$method = $_SERVER['REQUEST_METHOD'];

function sanitizeSubPath(string $subPath): string {
    $subPath = trim($subPath, '/\\');
    $subPath = preg_replace('/\.\.+/', '', $subPath);
    $subPath = preg_replace('/[^a-zA-Z0-9_\/\-]/', '', $subPath);
    return $subPath;
}

function buildUrl(string $relPath): string {
    return UPLOAD_BASE_URL . '/' . ltrim($relPath, '/');
}

// ── GET: List files and folders ───────────────────────────────────────────────
if ($method === 'GET') {
    $subPath   = sanitizeSubPath($_GET['path'] ?? $_GET['folder'] ?? '');
    $targetDir = UPLOAD_BASE_DIR . ($subPath !== '' ? '/' . $subPath : '');

    if (!is_dir($targetDir)) {
        json_not_found('Directory does not exist');
    }

    $search  = strtolower(trim($_GET['search'] ?? ''));
    $items   = scandir($targetDir);
    $folders = [];
    $files   = [];

    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        if ($search !== '' && !str_contains(strtolower($item), $search)) continue;

        $fullPath = $targetDir . '/' . $item;
        $stat     = stat($fullPath);
        $relPath  = $subPath !== '' ? $subPath . '/' . $item : $item;

        if (is_dir($fullPath)) {
            $folders[] = [
                'name'       => $item,
                'path'       => $relPath,
                'created_at' => date('c', $stat['mtime']),
            ];
        } else {
            $ext     = strtolower(pathinfo($item, PATHINFO_EXTENSION));
            $files[] = [
                'name'       => $item,
                'url'        => buildUrl($relPath),
                'path'       => $relPath,
                'size'       => $stat['size'],
                'ext'        => $ext,
                'created_at' => date('c', $stat['mtime']),
            ];
        }
    }

    json_success('Media items loaded', [
        'current_path' => $subPath,
        'folders'      => $folders,
        'files'        => $files,
    ]);
}

if ($method === 'POST') {
    // ── Upload file ──────────────────────────────────────────────────────────
    if ($action === 'upload') {
        $subPath = sanitizeSubPath($_POST['path'] ?? '');
        $result  = handleUpload('file', $subPath);
        json_success('File uploaded successfully', $result);
    }

    $body = getRequestBody();

    // ── Create folder ────────────────────────────────────────────────────────
    if ($action === 'create-folder') {
        $name    = preg_replace('/[^a-zA-Z0-9_\-]/', '', $body['name'] ?? '');
        $subPath = sanitizeSubPath($body['path'] ?? '');

        if ($name === '') json_error('Folder name is required or contains invalid characters');

        $targetDir = UPLOAD_BASE_DIR . ($subPath !== '' ? '/' . $subPath : '') . '/' . $name;

        if (is_dir($targetDir)) json_error('Folder already exists', 409);

        if (!mkdir($targetDir, 0755, true)) {
            json_server_error('Failed to create folder');
        }
        json_success('Folder created successfully');
    }

    // ── Delete file or folder ────────────────────────────────────────────────
    if ($action === 'delete') {
        $relPath  = sanitizeSubPath($body['path'] ?? '');
        if ($relPath === '') json_error('Path is required');

        $fullPath = UPLOAD_BASE_DIR . '/' . $relPath;

        if (!file_exists($fullPath)) json_not_found('File or folder does not exist');

        if (is_dir($fullPath)) {
            deleteDirectoryRecursive($fullPath);
            json_success('Folder and its contents deleted successfully');
        } else {
            unlink($fullPath);
            json_success('File deleted successfully');
        }
    }
}

json_error('Invalid request', 400);

function deleteDirectoryRecursive(string $dir): void {
    $items = array_diff(scandir($dir), ['.', '..']);
    foreach ($items as $item) {
        $path = $dir . '/' . $item;
        if (is_dir($path)) {
            deleteDirectoryRecursive($path);
        } else {
            unlink($path);
        }
    }
    rmdir($dir);
}
