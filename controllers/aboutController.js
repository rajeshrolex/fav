import pool from '../config/db.js';

export async function getAboutDetails(req, res) {
  try {
    const [timeline] = await pool.query('SELECT * FROM about_timeline ORDER BY display_order ASC, year ASC');

    const keys = [
      'about_preview_title', 'about_preview_subtitle', 'about_preview_text1', 
      'about_preview_text2', 'about_preview_mission', 'about_preview_vision',
      'about_preview_president_msg', 'about_preview_secretary_msg', 'about_history_full'
    ];

    const placeholders = keys.map(() => '?').join(', ');
    const [rows] = await pool.query(`SELECT * FROM settings WHERE key_name IN (${placeholders})`, keys);
    
    const details = {};
    for (const k of keys) {
      details[k] = '';
    }
    for (const row of rows) {
      details[row.key_name] = row.key_value;
    }

    return res.json({
      success: true,
      message: 'About page data loaded',
      data: { timeline, details }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to load About details: ${err.message}`, data: null });
  }
}

export async function addTimelineEvent(req, res) {
  const { year, title, description, display_order } = req.body || {};

  if (!year || !title || !description) {
    return res.status(400).json({ success: false, message: 'Year, title, and description are required', data: null });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO about_timeline (year, title, description, display_order) VALUES (?, ?, ?, ?)',
      [year.trim(), title.trim(), description.trim(), parseInt(display_order || '0', 10)]
    );

    return res.json({ success: true, message: 'Timeline event added successfully', data: { id: result.insertId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to add timeline event: ${err.message}`, data: null });
  }
}

export async function editTimelineEvent(req, res) {
  const { id, year, title, description, display_order } = req.body || {};
  const timelineId = parseInt(id, 10);

  if (!timelineId || !year || !title || !description) {
    return res.status(400).json({ success: false, message: 'ID, Year, title, and description are required', data: null });
  }

  try {
    await pool.query(
      'UPDATE about_timeline SET year = ?, title = ?, description = ?, display_order = ? WHERE id = ?',
      [year.trim(), title.trim(), description.trim(), parseInt(display_order || '0', 10), timelineId]
    );

    return res.json({ success: true, message: 'Timeline event updated successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to update timeline event: ${err.message}`, data: null });
  }
}

export async function deleteTimelineEvent(req, res) {
  const { id } = req.body || {};
  const timelineId = parseInt(id || req.params.id, 10);

  if (!timelineId) {
    return res.status(400).json({ success: false, message: 'Timeline event ID is required', data: null });
  }

  try {
    await pool.query('DELETE FROM about_timeline WHERE id = ?', [timelineId]);
    return res.json({ success: true, message: 'Timeline event deleted successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to delete timeline event: ${err.message}`, data: null });
  }
}

export async function updateAboutDetails(req, res) {
  const input = req.body || {};
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    for (const [key, val] of Object.entries(input)) {
      await conn.query(
        'REPLACE INTO settings (key_name, key_value) VALUES (?, ?)',
        [key, val !== null && val !== undefined ? String(val) : null]
      );
    }

    await conn.commit();
    conn.release();
    return res.json({ success: true, message: 'About details updated successfully', data: null });
  } catch (err) {
    await conn.rollback();
    conn.release();
    return res.status(500).json({ success: false, message: `Failed to update details: ${err.message}`, data: null });
  }
}
