<?php
// api/media.php
require_once __DIR__ . '/db.php';

// Auth Check (Media manager requires authenticated Admin/Editor access)
$user = requireAuth(['Super Admin', 'Admin', 'Editor']);

$baseUploadDir = __DIR__ . '/uploads';
if (!file_exists($baseUploadDir)) {
    mkdir($baseUploadDir, 0755, true);
}

// Get action
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Helper to sanitize folder paths and prevent directory traversal (e.g., ../)
function sanitizeSubPath($path) {
    $path = trim($path, '/\\');
    $path = str_replace(['..', './', '.\\'], '', $path);
    return $path;
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if ($action === 'list') {
            $subPath = isset($_GET['path']) ? sanitizeSubPath($_GET['path']) : '';
            $targetDir = empty($subPath) ? $baseUploadDir : $baseUploadDir . '/' . $subPath;

            if (!file_exists($targetDir) || !is_dir($targetDir)) {
                sendResponse(false, "Directory does not exist", null, 404);
            }

            $search = isset($_GET['search']) ? trim($_GET['search']) : '';
            $items = scandir($targetDir);
            
            $folders = [];
            $files = [];

            // Base URL to serve files
            $baseUrl = 'http://localhost:8000/api/uploads';
            $relativeUrlPrefix = empty($subPath) ? '' : $subPath . '/';

            foreach ($items as $item) {
                if ($item === '.' || $item === '..') continue;
                
                $fullPath = $targetDir . '/' . $item;
                $isDir = is_dir($fullPath);
                
                // If searching, filter by name
                if (!empty($search) && stripos($item, $search) === false) {
                    continue;
                }

                if ($isDir) {
                    $folders[] = [
                        'name' => $item,
                        'path' => empty($subPath) ? $item : $subPath . '/' . $item,
                        'created_at' => date('Y-m-d H:i:s', filectime($fullPath))
                    ];
                } else {
                    $ext = strtolower(pathinfo($item, PATHINFO_EXTENSION));
                    $files[] = [
                        'name' => $item,
                        'url' => $baseUrl . '/' . $relativeUrlPrefix . $item,
                        'path' => empty($subPath) ? $item : $subPath . '/' . $item,
                        'size' => filesize($fullPath),
                        'ext' => $ext,
                        'created_at' => date('Y-m-d H:i:s', filemtime($fullPath))
                    ];
                }
            }

            sendResponse(true, "Media items loaded", [
                'current_path' => $subPath,
                'folders' => $folders,
                'files' => $files
            ]);
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        if ($action === 'create_folder') {
            $folderName = isset($input['name']) ? trim($input['name']) : '';
            $subPath = isset($input['path']) ? sanitizeSubPath($input['path']) : '';

            if (empty($folderName)) {
                sendResponse(false, "Folder name is required", null, 400);
            }

            // Sanitize folder name
            $folderName = preg_replace('/[^a-zA-Z0-9_\-]/', '', $folderName);
            if (empty($folderName)) {
                sendResponse(false, "Invalid folder name", null, 400);
            }

            $targetDir = empty($subPath) ? $baseUploadDir . '/' . $folderName : $baseUploadDir . '/' . $subPath . '/' . $folderName;

            if (file_exists($targetDir)) {
                sendResponse(false, "Folder already exists", null, 409);
            }

            if (mkdir($targetDir, 0755, true)) {
                sendResponse(true, "Folder created successfully");
            } else {
                sendResponse(false, "Failed to create folder", null, 500);
            }
        } 
        elseif ($action === 'delete') {
            $pathToDelete = isset($input['path']) ? sanitizeSubPath($input['path']) : '';
            if (empty($pathToDelete)) {
                sendResponse(false, "Path is required", null, 400);
            }

            $fullPath = $baseUploadDir . '/' . $pathToDelete;

            if (!file_exists($fullPath)) {
                sendResponse(false, "File or folder does not exist", null, 404);
            }

            if (is_dir($fullPath)) {
                // Delete directory and its contents recursively
                function deleteDir($dirPath) {
                    if (!is_dir($dirPath)) return false;
                    $items = array_diff(scandir($dirPath), ['.', '..']);
                    foreach ($items as $item) {
                        $p = $dirPath . '/' . $item;
                        is_dir($p) ? deleteDir($p) : unlink($p);
                    }
                    return rmdir($dirPath);
                }

                if (deleteDir($fullPath)) {
                    sendResponse(true, "Folder and its contents deleted successfully");
                } else {
                    sendResponse(false, "Failed to delete folder", null, 500);
                }
            } else {
                // Delete single file
                if (unlink($fullPath)) {
                    sendResponse(true, "File deleted successfully");
                } else {
                    sendResponse(false, "Failed to delete file", null, 500);
                }
            }
        } 
        elseif ($action === 'upload') {
            $subPath = isset($_POST['path']) ? sanitizeSubPath($_POST['path']) : '';
            $targetDir = empty($subPath) ? $baseUploadDir : $baseUploadDir . '/' . $subPath;

            if (!file_exists($targetDir)) {
                mkdir($targetDir, 0755, true);
            }

            if (!isset($_FILES['file'])) {
                sendResponse(false, "No file uploaded", null, 400);
            }

            $file = $_FILES['file'];
            $fileName = $file['name'];
            $fileTmp = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileError = $file['error'];

            if ($fileError !== UPLOAD_ERR_OK) {
                sendResponse(false, "Upload error code: $fileError", null, 400);
            }

            // Secure File Checks
            $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            $allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'mp4', 'pdf'];
            if (!in_array($ext, $allowedExtensions)) {
                sendResponse(false, "File type not allowed. Allowed: PNG, JPG, JPEG, WEBP, GIF, MP4, PDF", null, 400);
            }

            // Limit sizes: Images (5MB), Videos (50MB)
            $isImage = in_array($ext, ['png', 'jpg', 'jpeg', 'webp', 'gif']);
            $maxSize = $isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
            if ($fileSize > $maxSize) {
                sendResponse(false, "File size exceeds the limit (" . ($maxSize / 1024 / 1024) . "MB)", null, 400);
            }

            // Generate safe filename to prevent XSS / Traversal / Overwrite
            $safeFileName = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.]/', '', $fileName);
            $destination = $targetDir . '/' . $safeFileName;

            // Compress Images using GD Library (convert JPEG/PNG to WebP with 80% compression if GD is available)
            $compressed = false;
            if ($isImage && extension_loaded('gd') && in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
                try {
                    if ($ext === 'jpg' || $ext === 'jpeg') {
                        $image = @imagecreatefromjpeg($fileTmp);
                    } elseif ($ext === 'png') {
                        $image = @imagecreatefrompng($fileTmp);
                        // preserve transparency
                        imagepalettetotruecolor($image);
                        imagealphablending($image, true);
                        imagesavealpha($image, true);
                    } elseif ($ext === 'webp') {
                        $image = @imagecreatefromwebp($fileTmp);
                    }

                    if ($image) {
                        // Change extension to .webp for compressed file
                        $webpFileName = pathinfo($safeFileName, PATHINFO_FILENAME) . '.webp';
                        $webpDestination = $targetDir . '/' . $webpFileName;
                        
                        if (@imagewebp($image, $webpDestination, 80)) { // 80% quality
                            imagedestroy($image);
                            $safeFileName = $webpFileName;
                            $destination = $webpDestination;
                            $compressed = true;
                        }
                    }
                } catch (\Exception $e) {
                    // Fall back to normal upload on GD failure
                }
            }

            if ($compressed || move_uploaded_file($fileTmp, $destination)) {
                $relativeUrlPrefix = empty($subPath) ? '' : $subPath . '/';
                $fileUrl = 'http://localhost:8000/api/uploads/' . $relativeUrlPrefix . $safeFileName;
                
                sendResponse(true, "File uploaded successfully", [
                    'name' => $safeFileName,
                    'url' => $fileUrl,
                    'path' => empty($subPath) ? $safeFileName : $subPath . '/' . $safeFileName,
                    'ext' => $isImage ? 'webp' : $ext
                ]);
            } else {
                sendResponse(false, "Failed to save file", null, 500);
            }
        }
        break;

    default:
        sendResponse(false, "Method not supported", null, 405);
        break;
}
