import fs from 'fs';
import path from 'path';

const uploadsDir = path.resolve('uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function sanitizeSubPath(subPath = '') {
  return subPath.trim().replace(/^[\/\\]+|[\/\\]+$/g, '').replace(/\.\./g, '');
}

export async function listMedia(req, res) {
  try {
    const subPath = sanitizeSubPath(req.query.path || req.query.folder || '');
    const targetDir = subPath ? path.join(uploadsDir, subPath) : uploadsDir;

    if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
      return res.status(404).json({ success: false, message: 'Directory does not exist', data: null });
    }

    const search = (req.query.search || '').trim().toLowerCase();
    const items = fs.readdirSync(targetDir);

    const folders = [];
    const files = [];

    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}/uploads`;
    const relativeUrlPrefix = subPath ? `${subPath}/` : '';

    for (const item of items) {
      if (item === '.' || item === '..') continue;
      if (search && !item.toLowerCase().includes(search)) continue;

      const fullPath = path.join(targetDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        folders.push({
          name: item,
          path: subPath ? `${subPath}/${item}` : item,
          created_at: stat.birthtime.toISOString()
        });
      } else {
        const ext = path.extname(item).replace('.', '').toLowerCase();
        files.push({
          name: item,
          url: `${baseUrl}/${relativeUrlPrefix}${item}`,
          path: subPath ? `${subPath}/${item}` : item,
          size: stat.size,
          ext,
          created_at: stat.mtime.toISOString()
        });
      }
    }

    return res.json({
      success: true,
      message: 'Media items loaded',
      data: {
        current_path: subPath,
        folders,
        files
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to list media: ${err.message}`, data: null });
  }
}

export async function createFolder(req, res) {
  const { name, path: subPathInput } = req.body || {};
  if (!name) {
    return res.status(400).json({ success: false, message: 'Folder name is required', data: null });
  }

  const folderName = name.replace(/[^a-zA-Z0-9_\-]/g, '');
  if (!folderName) {
    return res.status(400).json({ success: false, message: 'Invalid folder name', data: null });
  }

  const subPath = sanitizeSubPath(subPathInput || '');
  const targetDir = subPath ? path.join(uploadsDir, subPath, folderName) : path.join(uploadsDir, folderName);

  if (fs.existsSync(targetDir)) {
    return res.status(409).json({ success: false, message: 'Folder already exists', data: null });
  }

  try {
    fs.mkdirSync(targetDir, { recursive: true });
    return res.json({ success: true, message: 'Folder created successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to create folder: ${err.message}`, data: null });
  }
}

export async function deleteMediaItem(req, res) {
  const { path: pathToDeleteInput } = req.body || {};
  const pathToDelete = sanitizeSubPath(pathToDeleteInput || req.query.path || '');

  if (!pathToDelete) {
    return res.status(400).json({ success: false, message: 'Path is required', data: null });
  }

  const fullPath = path.join(uploadsDir, pathToDelete);

  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ success: false, message: 'File or folder does not exist', data: null });
  }

  try {
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      return res.json({ success: true, message: 'Folder and its contents deleted successfully', data: null });
    } else {
      fs.unlinkSync(fullPath);
      return res.json({ success: true, message: 'File deleted successfully', data: null });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to delete item: ${err.message}`, data: null });
  }
}

export async function handleFileUpload(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded', data: null });
  }

  const subPath = sanitizeSubPath(req.body.path || '');
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:3000';
  const relativeUrlPrefix = subPath ? `${subPath}/` : '';
  const fileUrl = `${protocol}://${host}/uploads/${relativeUrlPrefix}${req.file.filename}`;

  return res.json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      name: req.file.filename,
      url: fileUrl,
      path: subPath ? `${subPath}/${req.file.filename}` : req.file.filename,
      ext: path.extname(req.file.filename).replace('.', '').toLowerCase()
    }
  });
}
