import pool from '../config/db.js';
import fs from 'fs';
import path from 'path';

export async function getSettings(req, res) {
  const { action, page } = req.query;

  if (action === 'seo') {
    if (page) {
      try {
        const [rows] = await pool.query('SELECT * FROM seo_pages WHERE page_name = ?', [page]);
        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: `SEO for page '${page}' not found`, data: null });
        }
        return res.json({ success: true, message: `SEO for page '${page}' fetched`, data: rows[0] });
      } catch (err) {
        return res.status(500).json({ success: false, message: `Failed to fetch SEO: ${err.message}`, data: null });
      }
    } else {
      try {
        const [rows] = await pool.query('SELECT * FROM seo_pages');
        return res.json({ success: true, message: 'All SEO configurations fetched', data: rows });
      } catch (err) {
        return res.status(500).json({ success: false, message: `Failed to fetch SEO: ${err.message}`, data: null });
      }
    }
  }

  try {
    const [rows] = await pool.query('SELECT * FROM settings');
    const config = {};
    for (const row of rows) {
      config[row.key_name] = row.key_value;
    }
    return res.json({ success: true, message: 'Settings loaded successfully', data: config });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to fetch settings: ${err.message}`, data: null });
  }
}

export async function updateSeo(req, res) {
  const { page_name, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image } = req.body || {};

  if (!page_name) {
    return res.status(400).json({ success: false, message: 'Page name is required', data: null });
  }

  try {
    await pool.query(
      `INSERT OR REPLACE INTO seo_pages 
       (page_name, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        page_name,
        meta_title || null,
        meta_description || null,
        meta_keywords || null,
        og_title || null,
        og_description || null,
        og_image || null,
        twitter_title || null,
        twitter_description || null,
        twitter_image || null
      ]
    );

    return res.json({ success: true, message: `SEO for page '${page_name}' updated successfully`, data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to update SEO: ${err.message}`, data: null });
  }
}

export async function updateSettings(req, res) {
  const input = req.body || {};
  if (typeof input !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid payload', data: null });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    for (const [key, value] of Object.entries(input)) {
      await conn.query(
        'INSERT OR REPLACE INTO settings (key_name, key_value) VALUES (?, ?)',
        [key, value !== null && value !== undefined ? String(value) : null]
      );
    }

    await conn.commit();
    conn.release();
    return res.json({ success: true, message: 'Settings updated successfully', data: null });
  } catch (err) {
    await conn.rollback();
    conn.release();
    return res.status(500).json({ success: false, message: `Failed to update settings: ${err.message}`, data: null });
  }
}
