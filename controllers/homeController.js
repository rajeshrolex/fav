import pool from '../config/db.js';

export async function getHeroSlides(req, res) {
  try {
    const [slides] = await pool.query('SELECT * FROM hero_slides ORDER BY display_order ASC, id ASC');
    return res.json({ success: true, message: 'Hero slides fetched successfully', data: slides });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to fetch hero slides: ${err.message}`, data: null });
  }
}

export async function addHeroSlide(req, res) {
  const { image_url, badge, heading, description, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, display_order } = req.body || {};

  if (!image_url || !heading) {
    return res.status(400).json({ success: false, message: 'Image URL and heading are required', data: null });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO hero_slides 
       (image_url, badge, heading, description, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, display_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        image_url.trim(),
        badge ? badge.trim() : null,
        heading.trim(),
        description ? description.trim() : null,
        primary_btn_text ? primary_btn_text.trim() : null,
        primary_btn_link ? primary_btn_link.trim() : null,
        secondary_btn_text ? secondary_btn_text.trim() : null,
        secondary_btn_link ? secondary_btn_link.trim() : null,
        parseInt(display_order || '0', 10)
      ]
    );

    return res.json({ success: true, message: 'Hero slide added successfully', data: { id: result.insertId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to add slide: ${err.message}`, data: null });
  }
}

export async function editHeroSlide(req, res) {
  const { id, image_url, badge, heading, description, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, display_order } = req.body || {};
  const slideId = parseInt(id, 10);

  if (!slideId || !image_url || !heading) {
    return res.status(400).json({ success: false, message: 'Slide ID, Image URL, and heading are required', data: null });
  }

  try {
    await pool.query(
      `UPDATE hero_slides SET 
       image_url = ?, badge = ?, heading = ?, description = ?, 
       primary_btn_text = ?, primary_btn_link = ?, 
       secondary_btn_text = ?, secondary_btn_link = ?, 
       display_order = ? WHERE id = ?`,
      [
        image_url.trim(),
        badge ? badge.trim() : null,
        heading.trim(),
        description ? description.trim() : null,
        primary_btn_text ? primary_btn_text.trim() : null,
        primary_btn_link ? primary_btn_link.trim() : null,
        secondary_btn_text ? secondary_btn_text.trim() : null,
        secondary_btn_link ? secondary_btn_link.trim() : null,
        parseInt(display_order || '0', 10),
        slideId
      ]
    );

    return res.json({ success: true, message: 'Hero slide updated successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to update slide: ${err.message}`, data: null });
  }
}

export async function deleteHeroSlide(req, res) {
  const { id } = req.body || {};
  const slideId = parseInt(id || req.params.id, 10);

  if (!slideId) {
    return res.status(400).json({ success: false, message: 'Slide ID is required', data: null });
  }

  try {
    await pool.query('DELETE FROM hero_slides WHERE id = ?', [slideId]);
    return res.json({ success: true, message: 'Hero slide deleted successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to delete slide: ${err.message}`, data: null });
  }
}

export async function reorderHeroSlides(req, res) {
  const { orders } = req.body || {};

  if (!orders || typeof orders !== 'object') {
    return res.status(400).json({ success: false, message: 'Order details are required', data: null });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    for (const [id, order] of Object.entries(orders)) {
      await conn.query('UPDATE hero_slides SET display_order = ? WHERE id = ?', [parseInt(order, 10), parseInt(id, 10)]);
    }

    await conn.commit();
    conn.release();
    return res.json({ success: true, message: 'Slides reordered successfully', data: null });
  } catch (err) {
    await conn.rollback();
    conn.release();
    return res.status(500).json({ success: false, message: `Failed to reorder slides: ${err.message}`, data: null });
  }
}
