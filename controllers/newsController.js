import pool from '../config/db.js';

export async function getNews(req, res) {
  const slug = req.params.slug || req.query.slug;
  const id = req.query.id;

  try {
    if (slug) {
      const [rows] = await pool.query('SELECT * FROM news WHERE slug = ?', [slug]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Article not found', data: null });
      }
      return res.json({ success: true, message: 'Article details loaded', data: rows[0] });
    }

    if (id) {
      const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Article not found', data: null });
      }
      return res.json({ success: true, message: 'Article details loaded', data: rows[0] });
    }

    const [rows] = await pool.query('SELECT * FROM news ORDER BY publish_date DESC, id DESC');
    return res.json({ success: true, message: 'News articles loaded successfully', data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to fetch news: ${err.message}`, data: null });
  }
}

export async function createNews(req, res) {
  const { title, slug, category, author, summary, content, featured_image, publish_date, meta_title, meta_description } = req.body || {};

  if (!title || !content || !publish_date) {
    return res.status(400).json({ success: false, message: 'Title, Content, and Publish Date are required', data: null });
  }

  const generatedSlug = slug ? slug.trim() : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    const [result] = await pool.query(
      `INSERT INTO news 
       (title, slug, category, author, summary, content, featured_image, publish_date, meta_title, meta_description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        generatedSlug,
        category ? category.trim() : 'General',
        author ? author.trim() : null,
        summary ? summary.trim() : null,
        content.trim(),
        featured_image ? featured_image.trim() : null,
        publish_date.trim(),
        meta_title ? meta_title.trim() : null,
        meta_description ? meta_description.trim() : null
      ]
    );

    return res.json({ success: true, message: 'News article created successfully', data: { id: result.insertId, slug: generatedSlug } });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to create news: ${err.message}`, data: null });
  }
}

export async function editNews(req, res) {
  const { id, title, slug, category, author, summary, content, featured_image, publish_date, meta_title, meta_description } = req.body || {};
  const newsId = parseInt(id, 10);

  if (!newsId || !title || !content || !publish_date) {
    return res.status(400).json({ success: false, message: 'ID, Title, Content, and Publish Date are required', data: null });
  }

  const generatedSlug = slug ? slug.trim() : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    await pool.query(
      `UPDATE news SET 
       title = ?, slug = ?, category = ?, author = ?, summary = ?, content = ?, 
       featured_image = ?, publish_date = ?, meta_title = ?, meta_description = ? 
       WHERE id = ?`,
      [
        title.trim(),
        generatedSlug,
        category ? category.trim() : 'General',
        author ? author.trim() : null,
        summary ? summary.trim() : null,
        content.trim(),
        featured_image ? featured_image.trim() : null,
        publish_date.trim(),
        meta_title ? meta_title.trim() : null,
        meta_description ? meta_description.trim() : null,
        newsId
      ]
    );

    return res.json({ success: true, message: 'News article updated successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to update news: ${err.message}`, data: null });
  }
}

export async function deleteNews(req, res) {
  const { id } = req.body || {};
  const newsId = parseInt(id || req.params.id, 10);

  if (!newsId) {
    return res.status(400).json({ success: false, message: 'News ID is required', data: null });
  }

  try {
    await pool.query('DELETE FROM news WHERE id = ?', [newsId]);
    return res.json({ success: true, message: 'News article deleted successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to delete news: ${err.message}`, data: null });
  }
}
