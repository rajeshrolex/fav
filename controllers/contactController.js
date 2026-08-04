import pool from '../config/db.js';

export async function getContactMessages(req, res) {
  try {
    const reply_status = req.query.reply_status;
    let query = 'SELECT * FROM contact_messages';
    const params = [];

    if (reply_status) {
      query += ' WHERE reply_status = ?';
      params.push(reply_status);
    }
    query += ' ORDER BY created_at DESC, id DESC';

    const [rows] = await pool.query(query, params);
    return res.json({ success: true, message: 'Contact messages loaded successfully', data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to fetch messages: ${err.message}`, data: null });
  }
}

export async function submitContactMessage(req, res) {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, Email, and Message are required', data: null });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message, reply_status) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        name.trim(),
        email.trim(),
        subject ? subject.trim() : null,
        message.trim(),
        'Unread'
      ]
    );

    return res.json({ success: true, message: 'Your message has been sent successfully!', data: { id: result.insertId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to send message: ${err.message}`, data: null });
  }
}

export async function updateReplyStatus(req, res) {
  const { id, reply_status } = req.body || {};
  const messageId = parseInt(id, 10);

  if (!messageId || !reply_status) {
    return res.status(400).json({ success: false, message: 'Message ID and Reply Status are required', data: null });
  }

  try {
    await pool.query('UPDATE contact_messages SET reply_status = ? WHERE id = ?', [reply_status.trim(), messageId]);
    return res.json({ success: true, message: `Reply status updated to ${reply_status}`, data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to update reply status: ${err.message}`, data: null });
  }
}

export async function deleteContactMessage(req, res) {
  const { id } = req.body || {};
  const messageId = parseInt(id || req.params.id, 10);

  if (!messageId) {
    return res.status(400).json({ success: false, message: 'Message ID is required', data: null });
  }

  try {
    await pool.query('DELETE FROM contact_messages WHERE id = ?', [messageId]);
    return res.json({ success: true, message: 'Message deleted successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to delete message: ${err.message}`, data: null });
  }
}
