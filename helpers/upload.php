<?php
// helpers/upload.php — Secure file upload handler

$ALLOWED_MIME_TYPES = [
    'image/jpeg'    => 'jpg',
    'image/jpg'     => 'jpg',
    'image/png'     => 'png',
    'image/gif'     => 'gif',
    'image/webp'    => 'webp',
    'video/mp4'     => 'mp4',
    'application/pdf' => 'pdf',
];

$ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'pdf'];

/**
 * Handle file upload from $_FILES.
 * @param string $fieldName  — The $_FILES key (e.g. 'image', 'file')
 * @param string $subfolder  — Subdirectory inside uploads/ (e.g. 'events', 'committee')
 * @return array ['url' => '...', 'path' => '...', 'name' => '...']
 */
function handleUpload(string $fieldName = 'file', string $subfolder = ''): array {
    global $ALLOWED_MIME_TYPES, $ALLOWED_EXTENSIONS;

    if (!isset($_FILES[$fieldName]) || $_FILES[$fieldName]['error'] !== UPLOAD_ERR_OK) {
        $errCode = $_FILES[$fieldName]['error'] ?? -1;
        $errMsg  = uploadErrorMessage($errCode);
        json_error('Upload failed: ' . $errMsg, 400);
    }

    $file     = $_FILES[$fieldName];
    $tmpPath  = $file['tmp_name'];
    $origName = basename($file['name']);
    $fileSize = $file['size'];
    $ext      = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

    // Validate extension
    if (!in_array($ext, $ALLOWED_EXTENSIONS, true)) {
        json_error('File type not allowed. Allowed: JPG, PNG, GIF, WEBP, MP4, PDF', 400);
    }

    // Validate size
    if ($fileSize > MAX_UPLOAD_SIZE) {
        json_error('File size exceeds maximum allowed limit (10 MB)', 400);
    }

    // Validate MIME type using finfo
    $finfo    = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $tmpPath);
    finfo_close($finfo);

    if (!isset($ALLOWED_MIME_TYPES[$mimeType])) {
        json_error('Invalid file type. MIME type not allowed: ' . $mimeType, 400);
    }

    // Build safe subfolder path
    $subfolder = trim($subfolder, '/\\');
    $subfolder = preg_replace('/\.\.+/', '', $subfolder); // Prevent path traversal
    $subfolder = preg_replace('/[^a-zA-Z0-9_\/\-]/', '', $subfolder);

    $targetDir = UPLOAD_BASE_DIR;
    if ($subfolder !== '') {
        $targetDir .= '/' . $subfolder;
    }

    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    // Generate unique filename
    $safeBaseName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '', pathinfo($origName, PATHINFO_FILENAME));
    $safeBaseName = $safeBaseName ?: 'file';
    $fileName     = time() . '_' . $safeBaseName . '.' . $ext;
    $targetPath   = $targetDir . '/' . $fileName;

    if (!move_uploaded_file($tmpPath, $targetPath)) {
        json_error('Failed to save uploaded file. Check server permissions.', 500);
    }

    $relPath = ($subfolder !== '' ? $subfolder . '/' : '') . $fileName;
    $url     = UPLOAD_BASE_URL . '/' . $relPath;

    return [
        'name' => $fileName,
        'url'  => $url,
        'path' => $relPath,
        'ext'  => $ext,
        'size' => $fileSize,
    ];
}

/**
 * Delete a file from the uploads directory by relative path.
 */
function deleteUploadedFile(string $relPath): bool {
    $relPath  = ltrim($relPath, '/\\');
    $relPath  = preg_replace('/\.\.+/', '', $relPath);
    $fullPath = UPLOAD_BASE_DIR . '/' . $relPath;

    if (is_file($fullPath)) {
        return unlink($fullPath);
    }
    return false;
}

/**
 * Human-readable upload error messages.
 */
function uploadErrorMessage(int $code): string {
    $errors = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds server upload_max_filesize',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds form MAX_FILE_SIZE',
        UPLOAD_ERR_PARTIAL    => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE    => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION  => 'A PHP extension blocked the upload',
    ];
    return $errors[$code] ?? 'Unknown upload error (code ' . $code . ')';
}
