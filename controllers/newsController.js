import pool from '../config/db.js';

export async function getNews(req, res) {
  const slug = req.params.slug || req.query.slug;
  const id = req.query.id;

  const formatArticle = (n) => ({
    ...n,
    image: n.featured_image || n.image || n.image_url,
    image_url: n.featured_image || n.image || n.image_url,
    featured_image: n.featured_image || n.image || n.image_url,
    date: n.publish_date || n.date,
    publish_date: n.publish_date || n.date
  });

  try {
    if (slug) {
      const [rows] = await pool.query('SELECT * FROM news WHERE slug = ?', [slug]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Article not found', data: null });
      }
      return res.json({ success: true, message: 'Article details loaded', data: formatArticle(rows[0]) });
    }

    if (id) {
      const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Article not found', data: null });
      }
      return res.json({ success: true, message: 'Article details loaded', data: formatArticle(rows[0]) });
    }

    const [rows] = await pool.query('SELECT * FROM news ORDER BY publish_date DESC, id DESC');
    return res.json({ success: true, message: 'News articles loaded successfully', data: rows.map(formatArticle) });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to fetch news: ${err.message}`, data: null });
  }
}

export async function createNews(req, res) {
  const { title, slug, category, author, summary, content, featured_image, image, image_url, publish_date, date, meta_title, meta_description } = req.body || {};

  const finalDate = (publish_date || date || '').trim();
  const finalImg = (featured_image || image || image_url || '').trim();

  if (!title || !content || !finalDate) {
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
        finalImg || null,
        finalDate,
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
  const { id, title, slug, category, author, summary, content, featured_image, image, image_url, publish_date, date, meta_title, meta_description } = req.body || {};
  const newsId = parseInt(id, 10);

  const finalDate = (publish_date || date || '').trim();
  const finalImg = (featured_image || image || image_url || '').trim();

  if (!newsId || !title || !content || !finalDate) {
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
        finalImg || null,
        finalDate,
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
