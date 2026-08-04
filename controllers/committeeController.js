import pool from '../config/db.js';
import { getAuthUser } from '../middleware/authMiddleware.js';

export async function getCommittee(req, res) {
  const user = getAuthUser(req);
  try {
    let query = 'SELECT * FROM committee_members';
    if (!user) {
      query += ' WHERE is_active = 1';
    }
    query += ' ORDER BY display_order ASC, id DESC';

    const [rows] = await pool.query(query);
    const formatted = rows.map(m => ({
      ...m,
      role: m.position || m.role,
      position: m.position || m.role,
      image: m.photo_url || m.image || m.image_url,
      photo_url: m.photo_url || m.image || m.image_url,
      image_url: m.photo_url || m.image || m.image_url
    }));

    return res.json({ success: true, message: 'Committee members loaded successfully', data: formatted });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to fetch committee members: ${err.message}`, data: null });
  }
}

export async function addCommitteeMember(req, res) {
  const { name, position, role, department, photo_url, image_url, image, mobile, email, bio, display_order, is_active } = req.body || {};

  const finalName = (name || '').trim();
  const finalPos = (position || role || '').trim();
  const finalPhoto = (photo_url || image_url || image || '').trim();

  if (!finalName || !finalPos) {
    return res.status(400).json({ success: false, message: 'Name and Position are required', data: null });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO committee_members 
       (name, position, department, photo_url, mobile, email, bio, display_order, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        finalName,
        finalPos,
        department ? department.trim() : null,
        finalPhoto || null,
        mobile ? mobile.trim() : null,
        email ? email.trim() : null,
        bio ? bio.trim() : null,
        parseInt(display_order || '0', 10),
        is_active !== undefined ? (is_active ? 1 : 0) : 1
      ]
    );

    return res.json({ success: true, message: 'Committee member added successfully', data: { id: result.insertId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to add committee member: ${err.message}`, data: null });
  }
}

export async function editCommitteeMember(req, res) {
  const { id, name, position, role, department, photo_url, image_url, image, mobile, email, bio, display_order, is_active } = req.body || {};
  const memberId = parseInt(id, 10);

  const finalName = (name || '').trim();
  const finalPos = (position || role || '').trim();
  const finalPhoto = (photo_url || image_url || image || '').trim();

  if (!memberId || !finalName || !finalPos) {
    return res.status(400).json({ success: false, message: 'ID, Name and Position are required', data: null });
  }

  try {
    await pool.query(
      `UPDATE committee_members SET 
       name = ?, position = ?, department = ?, photo_url = ?, mobile = ?, email = ?, bio = ?, display_order = ?, is_active = ? 
       WHERE id = ?`,
      [
        finalName,
        finalPos,
        department ? department.trim() : null,
        finalPhoto || null,
        mobile ? mobile.trim() : null,
        email ? email.trim() : null,
        bio ? bio.trim() : null,
        parseInt(display_order || '0', 10),
        is_active ? 1 : 0,
        memberId
      ]
    );

    return res.json({ success: true, message: 'Committee member updated successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to update committee member: ${err.message}`, data: null });
  }
}

export async function deleteCommitteeMember(req, res) {
  const { id } = req.body || {};
  const memberId = parseInt(id || req.params.id, 10);

  if (!memberId) {
    return res.status(400).json({ success: false, message: 'Member ID is required', data: null });
  }

  try {
    await pool.query('DELETE FROM committee_members WHERE id = ?', [memberId]);
    return res.json({ success: true, message: 'Committee member deleted successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to delete committee member: ${err.message}`, data: null });
  }
}
