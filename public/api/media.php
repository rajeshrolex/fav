<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

$uploadDir = __DIR__ . '/../uploads/';
if (!file_exists($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

if ($method === 'GET') {
    $files = [];
    if (file_exists($uploadDir)) {
        $scanned = array_diff(scandir($uploadDir), ['.', '..']);
        foreach ($scanned as $f) {
            if (is_file($uploadDir . $f)) {
                $files[] = [
                    'name' => $f,
                    'url' => '/uploads/' . $f,
                    'size' => filesize($uploadDir . $f),
                    'updated_at' => filemtime($uploadDir . $f)
                ];
            }
        }
    }
    json_response(true, 'Media list retrieved', $files);
}

if ($method === 'POST') {
    $authUser = get_auth_user();
    if (!$authUser) {
        json_response(false, 'Unauthorized', null, 401);
    }

    $body = get_body();

    if ($action === 'upload' || isset($_FILES['file']) || isset($body['base64'])) {
        $fileUrl = '';
        $fileName = '';

        if (isset($_FILES['file'])) {
            $file = $_FILES['file'];
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '', $file['name']);
            $targetPath = $uploadDir . $fileName;

            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                $fileUrl = '/uploads/' . $fileName;
            }
        } elseif (isset($body['base64'])) {
            $data = $body['base64'];
            if (preg_match('/^data:image\/(\w+);base64,/', $data, $type)) {
                $data = substr($data, strpos($data, ',') + 1);
                $type = strtolower($type[1]);
                $data = base64_decode($data);
                if ($data !== false) {
                    $fileName = time() . '_' . uniqid() . '.' . $type;
                    file_put_contents($uploadDir . $fileName, $data);
                    $fileUrl = '/uploads/' . $fileName;
                }
            }
        }

        if (!empty($fileUrl)) {
            json_response(true, 'File uploaded successfully', [
                'url' => $fileUrl,
                'name' => $fileName
            ]);
        }

        json_response(false, 'File upload failed', null, 400);
    }

    if ($action === 'delete') {
        $filename = isset($body['filename']) ? trim($body['filename']) : (isset($body['name']) ? trim($body['name']) : '');
        if (!$filename) {
            json_response(false, 'Filename is required', null, 400);
        }

        $cleanName = basename($filename);
        $target = $uploadDir . $cleanName;
        if (file_exists($target)) {
            @unlink($target);
        }

        json_response(true, 'File deleted successfully', null);
    }
}
