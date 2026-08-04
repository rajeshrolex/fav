import pool from '../config/db.js';

export async function getVolunteers(req, res) {
  try {
    const status = req.query.status;
    let query = 'SELECT * FROM volunteers';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC, id DESC';

    const [rows] = await pool.query(query, params);
    return res.json({ success: true, message: 'Volunteers loaded successfully', data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to fetch volunteers: ${err.message}`, data: null });
  }
}

export async function applyVolunteer(req, res) {
  const { name, mobile, email, address, skills } = req.body || {};

  if (!name || !mobile || !email) {
    return res.status(400).json({ success: false, message: 'Name, Mobile, and Email are required', data: null });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO volunteers (name, mobile, email, address, skills, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        mobile.trim(),
        email.trim(),
        address ? address.trim() : null,
        skills ? skills.trim() : null,
        'Pending'
      ]
    );

    return res.json({ success: true, message: 'Volunteer application submitted successfully!', data: { id: result.insertId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to submit application: ${err.message}`, data: null });
  }
}

export async function updateVolunteerStatus(req, res) {
  const { id, status } = req.body || {};
  const volunteerId = parseInt(id, 10);

  if (!volunteerId || !status) {
    return res.status(400).json({ success: false, message: 'Volunteer ID and Status are required', data: null });
  }

  try {
    await pool.query('UPDATE volunteers SET status = ? WHERE id = ?', [status.trim(), volunteerId]);
    return res.json({ success: true, message: `Volunteer status updated to ${status}`, data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to update status: ${err.message}`, data: null });
  }
}

export async function deleteVolunteer(req, res) {
  const { id } = req.body || {};
  const volunteerId = parseInt(id || req.params.id, 10);

  if (!volunteerId) {
    return res.status(400).json({ success: false, message: 'Volunteer ID is required', data: null });
  }

  try {
    await pool.query('DELETE FROM volunteers WHERE id = ?', [volunteerId]);
    return res.json({ success: true, message: 'Volunteer application deleted successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to delete volunteer: ${err.message}`, data: null });
  }
}
