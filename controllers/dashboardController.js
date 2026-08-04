import pool from '../config/db.js';

export async function getDashboardStats(req, res) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Record today's visit (SQLite-compatible upsert)
    await pool.query(
      'INSERT OR IGNORE INTO visitor_stats (visit_date, hits) VALUES (?, 0)',
      [today]
    );
    await pool.query(
      'UPDATE visitor_stats SET hits = hits + 1 WHERE visit_date = ?',
      [today]
    );

    const [[eventsCount]] = await pool.query('SELECT COUNT(*) as count FROM events');
    const [[volunteersCount]] = await pool.query('SELECT COUNT(*) as count FROM volunteers WHERE status = "Pending"');
    const [[messagesCount]] = await pool.query('SELECT COUNT(*) as count FROM contact_messages WHERE reply_status = "Unread"');
    const [[newsCount]] = await pool.query('SELECT COUNT(*) as count FROM news');
    const [[sponsorsCount]] = await pool.query('SELECT COUNT(*) as count FROM sponsors');
    const [[committeeCount]] = await pool.query('SELECT COUNT(*) as count FROM committee_members');
    const [recentMessages] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5');
    const [recentVolunteers] = await pool.query('SELECT * FROM volunteers ORDER BY created_at DESC LIMIT 5');

    const [visitRows] = await pool.query(
      'SELECT visit_date, hits FROM visitor_stats ORDER BY visit_date DESC LIMIT 7'
    );

    return res.json({
      success: true,
      message: 'Dashboard statistics fetched successfully',
      data: {
        counts: {
          events: eventsCount.count,
          pending_volunteers: volunteersCount.count,
          unread_messages: messagesCount.count,
          news: newsCount.count,
          sponsors: sponsorsCount.count,
          committee: committeeCount.count
        },
        recent_messages: recentMessages,
        recent_volunteers: recentVolunteers,
        visitor_chart: visitRows.reverse()
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Failed to fetch dashboard stats: ${err.message}`, data: null });
  }
}
