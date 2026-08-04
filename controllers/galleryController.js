import pool from '../config/db.js';

export async function getGallery(req, res) {
  try {
    const category = req.query.category;
    const album = req.query.album;

    let query = 'SELECT * FROM gallery';
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (album) {
      conditions.push('album_name = ?');
      params.push(album);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC, id DESC';

    const [rows] = await pool.query(query, params);
    return res.json({ success: true, message: 'Gallery media loaded successfully', data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to fetch gallery: ${err.message}`, data: null });
  }
}

export async function addGalleryItem(req, res) {
  const { title, category, album_name, media_type, media_url, thumbnail_url } = req.body || {};

  if (!media_url) {
    return res.status(400).json({ success: false, message: 'Media URL is required', data: null });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO gallery (title, category, album_name, media_type, media_url, thumbnail_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title ? title.trim() : null,
        category ? category.trim() : 'General',
        album_name ? album_name.trim() : 'General',
        media_type ? media_type.trim() : 'image',
        media_url.trim(),
        thumbnail_url ? thumbnail_url.trim() : null
      ]
    );

    return res.json({ success: true, message: 'Media added to gallery successfully', data: { id: result.insertId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to add media: ${err.message}`, data: null });
  }
}

export async function deleteGalleryItem(req, res) {
  const { id } = req.body || {};
  const itemId = parseInt(id || req.params.id, 10);

  if (!itemId) {
    return res.status(400).json({ success: false, message: 'Media ID is required', data: null });
  }

  try {
    await pool.query('DELETE FROM gallery WHERE id = ?', [itemId]);
    return res.json({ success: true, message: 'Media deleted from gallery successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to delete media: ${err.message}`, data: null });
  }
}
