import pool from '../config/db.js';
import { getAuthUser } from '../middleware/authMiddleware.js';

export async function getEvents(req, res) {
  const user = getAuthUser(req);
  const id = parseInt(req.query.id || req.params.id || '0', 10);

  try {
    if (id > 0) {
      const [events] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
      if (events.length === 0) {
        return res.status(404).json({ success: false, message: 'Event not found', data: null });
      }
      const event = events[0];
      const [gallery] = await pool.query('SELECT * FROM event_gallery WHERE event_id = ?', [id]);
      event.gallery = gallery;
      return res.json({ success: true, message: 'Event details fetched', data: event });
    }

    let query = 'SELECT * FROM events';
    if (!user) {
      query += " WHERE status != 'Cancelled'";
    }
    query += ' ORDER BY event_date DESC, id DESC';

    const [events] = await pool.query(query);
    return res.json({ success: true, message: 'Events list fetched successfully', data: events });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to fetch events: ${err.message}`, data: null });
  }
}

export async function getRegistrations(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT r.*, e.title as event_title FROM event_registrations r JOIN events e ON r.event_id = e.id ORDER BY r.created_at DESC'
    );
    return res.json({ success: true, message: 'Registrations fetched successfully', data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to fetch registrations: ${err.message}`, data: null });
  }
}

export async function registerForEvent(req, res) {
  const { event_id, name, email, phone, tickets } = req.body || {};
  const eventId = parseInt(event_id, 10);
  const ticketCount = parseInt(tickets || '1', 10);

  if (!eventId || !name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Event ID, Name, Email, and Phone are required', data: null });
  }

  try {
    await pool.query(
      'INSERT INTO event_registrations (event_id, name, email, phone, tickets) VALUES (?, ?, ?, ?, ?)',
      [eventId, name, email, phone, ticketCount]
    );
    return res.json({ success: true, message: 'Successfully registered for this event!', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to register for event: ${err.message}`, data: null });
  }
}

export async function addEvent(req, res) {
  const { title, description, event_date, event_time, venue, cover_image, registration_link, status, is_featured, gallery } = req.body || {};

  if (!title || !description || !event_date || !event_time || !venue) {
    return res.status(400).json({ success: false, message: 'Title, description, date, time, and venue are required', data: null });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO events 
       (title, description, event_date, event_time, venue, cover_image, registration_link, status, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        description.trim(),
        event_date.trim(),
        event_time.trim(),
        venue.trim(),
        cover_image ? cover_image.trim() : null,
        registration_link ? registration_link.trim() : null,
        status ? status.trim() : 'Upcoming',
        is_featured ? 1 : 0
      ]
    );
    const eventId = result.insertId;

    if (Array.isArray(gallery)) {
      for (const imgUrl of gallery) {
        if (imgUrl && imgUrl.trim()) {
          await pool.query('INSERT INTO event_gallery (event_id, image_url) VALUES (?, ?)', [eventId, imgUrl.trim()]);
        }
      }
    }

    return res.json({ success: true, message: 'Event created successfully', data: { id: eventId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to create event: ${err.message}`, data: null });
  }
}

export async function editEvent(req, res) {
  const { id, title, description, event_date, event_time, venue, cover_image, registration_link, status, is_featured, gallery } = req.body || {};
  const eventId = parseInt(id, 10);

  if (!eventId || !title || !description || !event_date || !event_time || !venue) {
    return res.status(400).json({ success: false, message: 'ID, Title, description, date, time, and venue are required', data: null });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE events SET 
       title = ?, description = ?, event_date = ?, event_time = ?, 
       venue = ?, cover_image = ?, registration_link = ?, status = ?, is_featured = ? 
       WHERE id = ?`,
      [
        title.trim(),
        description.trim(),
        event_date.trim(),
        event_time.trim(),
        venue.trim(),
        cover_image ? cover_image.trim() : null,
        registration_link ? registration_link.trim() : null,
        status ? status.trim() : 'Upcoming',
        is_featured ? 1 : 0,
        eventId
      ]
    );

    if (Array.isArray(gallery)) {
      await conn.query('DELETE FROM event_gallery WHERE event_id = ?', [eventId]);
      for (const imgUrl of gallery) {
        if (imgUrl && imgUrl.trim()) {
          await conn.query('INSERT INTO event_gallery (event_id, image_url) VALUES (?, ?)', [eventId, imgUrl.trim()]);
        }
      }
    }

    await conn.commit();
    conn.release();
    return res.json({ success: true, message: 'Event updated successfully', data: null });
  } catch (err) {
    await conn.rollback();
    conn.release();
    return res.status(500).json({ success: false, message: `Failed to update event: ${err.message}`, data: null });
  }
}

export async function deleteEvent(req, res) {
  const { id } = req.body || {};
  const eventId = parseInt(id || req.params.id, 10);

  if (!eventId) {
    return res.status(400).json({ success: false, message: 'Event ID is required', data: null });
  }

  try {
    await pool.query('DELETE FROM events WHERE id = ?', [eventId]);
    return res.json({ success: true, message: 'Event deleted successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to delete event: ${err.message}`, data: null });
  }
}
