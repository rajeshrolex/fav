import pool from '../config/db.js';

export async function getHistoryEvents(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM about_timeline ORDER BY display_order ASC, year ASC, id DESC');
    return res.json({
      success: true,
      message: 'Festival history timeline retrieved successfully',
      data: rows
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Failed to fetch history timeline: ${err.message}`,
      data: null
    });
  }
}

export async function addHistoryEvent(req, res) {
  const { year, title, description, display_order } = req.body || {};

  if (!year || !title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Year, title, and description are required',
      data: null
    });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO about_timeline (year, title, description, display_order) VALUES (?, ?, ?, ?)',
      [String(year).trim(), String(title).trim(), String(description).trim(), parseInt(display_order || '0', 10)]
    );

    return res.json({
      success: true,
      message: 'Historical milestone added successfully',
      data: { id: result.insertId }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Failed to add historical milestone: ${err.message}`,
      data: null
    });
  }
}

export async function updateHistoryEvent(req, res) {
  const { id, year, title, description, display_order } = req.body || {};
  const milestoneId = parseInt(id || req.params.id, 10);

  if (!milestoneId || !year || !title || !description) {
    return res.status(400).json({
      success: false,
      message: 'ID, Year, title, and description are required',
      data: null
    });
  }

  try {
    await pool.query(
      'UPDATE about_timeline SET year = ?, title = ?, description = ?, display_order = ? WHERE id = ?',
      [String(year).trim(), String(title).trim(), String(description).trim(), parseInt(display_order || '0', 10), milestoneId]
    );

    return res.json({
      success: true,
      message: 'Historical milestone updated successfully',
      data: null
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Failed to update historical milestone: ${err.message}`,
      data: null
    });
  }
}

export async function deleteHistoryEvent(req, res) {
  const milestoneId = parseInt(req.body?.id || req.params.id, 10);

  if (!milestoneId) {
    return res.status(400).json({
      success: false,
      message: 'Milestone ID is required',
      data: null
    });
  }

  try {
    await pool.query('DELETE FROM about_timeline WHERE id = ?', [milestoneId]);
    return res.json({
      success: true,
      message: 'Historical milestone deleted successfully',
      data: null
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Failed to delete historical milestone: ${err.message}`,
      data: null
    });
  }
}
