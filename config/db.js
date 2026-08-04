import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'Org_Temp',
  password: process.env.DB_PASS || 'Vikrin@199',
  database: process.env.DB_NAME || 'Org_Temp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Auto-initialize database tables and default admin user if missing
export async function initDb() {
  try {
    // Create database if not exists
    const tempConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'Org_Temp',
      password: process.env.DB_PASS || 'Vikrin@199'
    });
    
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'Org_Temp'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await tempConn.end();

    const tableQueries = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('Super Admin', 'Admin', 'Editor') DEFAULT 'Super Admin',
        reset_token VARCHAR(255) NULL,
        reset_token_expires DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS settings (
        key_name VARCHAR(100) PRIMARY KEY,
        key_value TEXT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS seo_pages (
        page_name VARCHAR(50) PRIMARY KEY,
        meta_title VARCHAR(255) NULL,
        meta_description TEXT NULL,
        meta_keywords TEXT NULL,
        og_title VARCHAR(255) NULL,
        og_description TEXT NULL,
        og_image VARCHAR(255) NULL,
        twitter_title VARCHAR(255) NULL,
        twitter_description TEXT NULL,
        twitter_image VARCHAR(255) NULL
      )`,
      `CREATE TABLE IF NOT EXISTS hero_slides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(255) NOT NULL,
        badge VARCHAR(255) NULL,
        heading VARCHAR(255) NOT NULL,
        description TEXT NULL,
        primary_btn_text VARCHAR(50) NULL,
        primary_btn_link VARCHAR(255) NULL,
        secondary_btn_text VARCHAR(50) NULL,
        secondary_btn_link VARCHAR(255) NULL,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS about_timeline (
        id INT AUTO_INCREMENT PRIMARY KEY,
        year VARCHAR(10) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        display_order INT DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS committee_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        department VARCHAR(100) NULL,
        photo_url VARCHAR(255) NULL,
        mobile VARCHAR(20) NULL,
        email VARCHAR(100) NULL,
        bio TEXT NULL,
        display_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        event_date DATE NOT NULL,
        event_time VARCHAR(100) NOT NULL,
        venue VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT 'General',
        cover_image VARCHAR(255) NULL,
        registration_link VARCHAR(255) NULL,
        status ENUM('Upcoming', 'Past', 'Cancelled') DEFAULT 'Upcoming',
        is_featured TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS event_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NULL,
        category VARCHAR(100) DEFAULT 'General',
        album_name VARCHAR(100) DEFAULT 'General',
        media_type ENUM('image', 'video') DEFAULT 'image',
        media_url VARCHAR(255) NOT NULL,
        thumbnail_url VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS sponsors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        logo_url VARCHAR(255) NOT NULL,
        website VARCHAR(255) NULL,
        category VARCHAR(100) DEFAULT 'Bronze',
        priority INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS volunteers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        email VARCHAR(100) NOT NULL,
        address TEXT NULL,
        skills VARCHAR(255) NULL,
        status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NULL,
        message TEXT NOT NULL,
        reply_status ENUM('Unread', 'Read', 'Replied') DEFAULT 'Unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        category VARCHAR(100) NULL,
        author VARCHAR(100) NULL,
        summary TEXT NULL,
        content TEXT NOT NULL,
        featured_image VARCHAR(255) NULL,
        publish_date DATE NOT NULL,
        meta_title VARCHAR(255) NULL,
        meta_description TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS visitor_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        visit_date DATE NOT NULL UNIQUE,
        hits INT DEFAULT 1
      )`,
      `CREATE TABLE IF NOT EXISTS event_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        tickets INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )`
    ];

    for (const q of tableQueries) {
      await pool.query(q);
    }

    // Insert default superadmin user if users table is empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users WHERE username = ?', ['superadmin']);
    if (rows[0].count === 0) {
      const passHash = await bcrypt.hash('admin@123', 10);
      await pool.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['superadmin', 'superadmin@vikrin.org', passHash, 'Super Admin']
      );
    }
    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Database initialization warning:', err.message);
  }
}

export default pool;
