import pool from '../config/db.js';
import { getAuthUser } from '../middleware/authMiddleware.js';

export async function getSponsors(req, res) {
  const user = getAuthUser(req);
  try {
    let query = 'SELECT * FROM sponsors';
    if (!user) {
      query += ' WHERE is_active = 1';
    }
    query += ' ORDER BY priority ASC, id DESC';

    const [rows] = await pool.query(query);
    return res.json({ success: true, message: 'Sponsors loaded successfully', data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to fetch sponsors: ${err.message}`, data: null });
  }
}

export async function addSponsor(req, res) {
  const { name, logo_url, website, category, priority, is_active } = req.body || {};

  if (!name || !logo_url) {
    return res.status(400).json({ success: false, message: 'Sponsor name and logo URL are required', data: null });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO sponsors (name, logo_url, website, category, priority, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        logo_url.trim(),
        website ? website.trim() : null,
        category ? category.trim() : 'Bronze',
        parseInt(priority || '0', 10),
        is_active !== undefined ? (is_active ? 1 : 0) : 1
      ]
    );

    return res.json({ success: true, message: 'Sponsor added successfully', data: { id: result.insertId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to add sponsor: ${err.message}`, data: null });
  }
}

export async function editSponsor(req, res) {
  const { id, name, logo_url, website, category, priority, is_active } = req.body || {};
  const sponsorId = parseInt(id, 10);

  if (!sponsorId || !name || !logo_url) {
    return res.status(400).json({ success: false, message: 'ID, Sponsor name and logo URL are required', data: null });
  }

  try {
    await pool.query(
      `UPDATE sponsors SET 
       name = ?, logo_url = ?, website = ?, category = ?, priority = ?, is_active = ? 
       WHERE id = ?`,
      [
        name.trim(),
        logo_url.trim(),
        website ? website.trim() : null,
        category ? category.trim() : 'Bronze',
        parseInt(priority || '0', 10),
        is_active ? 1 : 0,
        sponsorId
      ]
    );

    return res.json({ success: true, message: 'Sponsor updated successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to update sponsor: ${err.message}`, data: null });
  }
}

export async function deleteSponsor(req, res) {
  const { id } = req.body || {};
  const sponsorId = parseInt(id || req.params.id, 10);

  if (!sponsorId) {
    return res.status(400).json({ success: false, message: 'Sponsor ID is required', data: null });
  }

  try {
    await pool.query('DELETE FROM sponsors WHERE id = ?', [sponsorId]);
    return res.json({ success: true, message: 'Sponsor deleted successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to delete sponsor: ${err.message}`, data: null });
  }
}
