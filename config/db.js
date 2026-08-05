import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '../api/database.sqlite');

// Dynamically import better-sqlite3 to prevent crash if not installed/compiled
let Database;
try {
  Database = require('better-sqlite3');
} catch (err) {
  console.log('⚠️ better-sqlite3 is not available. Using MySQL fallback if configured.');
}

const useMySQL = !!(process.env.DB_HOST && process.env.DB_USER);

let mysqlPool = null;
let sqliteDb = null;
let activeDatabase = 'sqlite'; // Default to SQLite, can switch to MySQL dynamically

if (useMySQL) {
  try {
    console.log('🔌 Configuring MySQL connection pool at', process.env.DB_HOST);
    mysqlPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  } catch (err) {
    console.error('❌ Failed to configure MySQL pool:', err.message);
  }
}

// Helper to open SQLite database lazily when needed
function getSqliteDb() {
  if (!sqliteDb) {
    if (!Database) {
      throw new Error('SQLite driver (better-sqlite3) is not available');
    }
    try {
      sqliteDb = new Database(DB_PATH);
      sqliteDb.pragma('journal_mode = WAL');
      sqliteDb.pragma('foreign_keys = ON');
      console.log('🔌 Using local SQLite database at', DB_PATH);
    } catch (err) {
      throw new Error(`Failed to open SQLite database: ${err.message}`);
    }
  }
  return sqliteDb;
}

// ─── SQLite-compatible pool shim ─────────────────────────────────────────────

function adaptSql(sql) {
  return sql
    // Convert INSERT IGNORE INTO -> INSERT OR IGNORE INTO
    .replace(/INSERT\s+IGNORE\s+INTO/gi, 'INSERT OR IGNORE INTO')
    // ON DUPLICATE KEY UPDATE → INSERT OR REPLACE (simplified handling)
    .replace(/INSERT\s+INTO\s+settings\s*\(key_name,\s*key_value\)\s*VALUES\s*\(\?,\s*\?\)\s+ON\s+DUPLICATE\s+KEY\s+UPDATE\s+key_value\s*=\s*VALUES\s*\(key_value\)/gi,
      'INSERT OR REPLACE INTO settings (key_name, key_value) VALUES (?, ?)')
    // SEO pages upsert
    .replace(/INSERT\s+INTO\s+seo_pages[\s\S]+?ON\s+DUPLICATE\s+KEY\s+UPDATE[\s\S]+?twitter_image\)/gi, (match) => {
      return match
        .replace(/INSERT\s+INTO/, 'INSERT OR REPLACE INTO')
        .replace(/\s+ON\s+DUPLICATE\s+KEY\s+UPDATE[\s\S]+/, '');
    })
    // General ON DUPLICATE KEY UPDATE removal for simple upserts
    .replace(/\s+ON\s+DUPLICATE\s+KEY\s+UPDATE[\s\S]+/gi, '')
    // TINYINT(1) → INTEGER
    .replace(/TINYINT\(1\)/gi, 'INTEGER')
    // AUTO_INCREMENT → AUTOINCREMENT (SQLite)
    .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT')
    // ENUM(...) → TEXT
    .replace(/ENUM\([^)]+\)/gi, 'TEXT')
    // Remove CHARACTER SET and COLLATE
    .replace(/CHARACTER\s+SET\s+\S+/gi, '')
    .replace(/COLLATE\s+\S+/gi, '')
    // Remove DEFAULT CURRENT_TIMESTAMP (keep as default)
    .replace(/TIMESTAMP\s+DEFAULT\s+CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT (datetime(\'now\'))')
    // Remove IF NOT EXISTS for CREATE DATABASE (not supported in SQLite)
    .replace(/CREATE\s+DATABASE\s+IF\s+NOT\s+EXISTS\s+`?\w+`?\s*;?/gi, '')
    .replace(/USE\s+`?\w+`?\s*;?/gi, '');
}

function executeQuery(sql, params = []) {
  const dbInstance = getSqliteDb();
  let flatParams = [];
  let rawSql = sql.trim();

  if (Array.isArray(params)) {
    for (const p of params) {
      if (Array.isArray(p)) {
        const placeholders = p.map(() => '?').join(', ');
        rawSql = rawSql.replace(/\bIN\s*\(\s*\?\s*\)/gi, `IN (${placeholders})`);
        flatParams.push(...p);
      } else {
        flatParams.push(p);
      }
    }
  } else {
    flatParams = params;
  }

  const adaptedSql = adaptSql(rawSql);
  
  if (!adaptedSql.trim()) {
    return [[], []];
  }

  const upperSql = adaptedSql.trim().toUpperCase();

  try {
    if (upperSql.startsWith('SELECT') || upperSql.startsWith('PRAGMA') || upperSql.startsWith('SHOW')) {
      const stmt = dbInstance.prepare(adaptedSql);
      const rows = stmt.all(...flatParams);
      return [rows, []];
    } else {
      const stmt = dbInstance.prepare(adaptedSql);
      const info = stmt.run(...flatParams);
      return [{ affectedRows: info.changes, insertId: info.lastInsertRowid, changes: info.changes }, []];
    }
  } catch (err) {
    throw err;
  }
}

// Unified pool exporter
const pool = {
  async query(sql, params = []) {
    if (activeDatabase === 'mysql') {
      if (!mysqlPool) throw new Error('MySQL pool is not initialized');
      return mysqlPool.query(sql, params);
    } else {
      return executeQuery(sql, params);
    }
  },

  async getConnection() {
    if (activeDatabase === 'mysql') {
      if (!mysqlPool) throw new Error('MySQL pool is not initialized');
      return mysqlPool.getConnection();
    } else {
      const dbInstance = getSqliteDb();
      return {
        async query(sql, params = []) {
          return executeQuery(sql, params);
        },
        async beginTransaction() {
          dbInstance.exec('BEGIN');
        },
        async commit() {
          dbInstance.exec('COMMIT');
        },
        async rollback() {
          dbInstance.exec('ROLLBACK');
        },
        release() {
          // No-op for SQLite
        }
      };
    }
  }
};

// ─── Database Initialization & Seeding ──────────────────────────────────────────

export async function initDb() {
  try {
    if (useMySQL && mysqlPool) {
      try {
        console.log('🔌 Verifying MySQL connection...');
        // Try getting a connection to confirm MySQL is alive
        const connection = await mysqlPool.getConnection();
        connection.release();
        activeDatabase = 'mysql';
        console.log('✅ Connected to MySQL database successfully.');
      } catch (err) {
        console.warn('⚠️ MySQL connection failed:', err.message);
        console.warn('🔌 Falling back to local SQLite database.');
        activeDatabase = 'sqlite';
      }
    } else {
      activeDatabase = 'sqlite';
    }

    if (activeDatabase === 'mysql') {
      // Connect to MySQL and initialize schema from database.sql
      const sqlPath = path.resolve(__dirname, '../api/database.sql');
      if (!fs.existsSync(sqlPath)) {
        console.log('⚠️ database.sql schema file not found at', sqlPath);
        return;
      }

      const connection = await mysqlPool.getConnection();
      try {
        const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
        if (tables.length === 0) {
          console.log('⚙️ Initializing MySQL database schema...');
          const sqlContent = fs.readFileSync(sqlPath, 'utf8');
          const queries = sqlContent
            .split(';')
            .map(q => q.replace(/--.*$/gm, '').trim())
            .filter(q => q.length > 0);

          for (let query of queries) {
            if (query.toUpperCase().startsWith('CREATE DATABASE') || query.toUpperCase().startsWith('USE ')) {
              continue;
            }
            await connection.query(query);
          }
          console.log('✅ MySQL database tables created successfully.');
        } else {
          console.log('✅ MySQL database tables already exist.');
        }
      } finally {
        connection.release();
      }
    } else {
      // SQLite init
      const dbInstance = getSqliteDb();
      dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          role TEXT DEFAULT 'Super Admin',
          reset_token VARCHAR(255) NULL,
          reset_token_expires DATETIME NULL,
          created_at DATETIME DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS settings (
          key_name VARCHAR(100) PRIMARY KEY,
          key_value TEXT NULL
        );

        CREATE TABLE IF NOT EXISTS seo_pages (
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
        );

        CREATE TABLE IF NOT EXISTS hero_slides (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          image_url VARCHAR(255) NOT NULL,
          badge VARCHAR(255) NULL,
          heading VARCHAR(255) NOT NULL,
          description TEXT NULL,
          primary_btn_text VARCHAR(50) NULL,
          primary_btn_link VARCHAR(255) NULL,
          secondary_btn_text VARCHAR(50) NULL,
          secondary_btn_link VARCHAR(255) NULL,
          display_order INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS about_timeline (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          year VARCHAR(10) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          display_order INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS committee_members (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL,
          position VARCHAR(100) NOT NULL,
          department VARCHAR(100) NULL,
          photo_url VARCHAR(255) NULL,
          mobile VARCHAR(20) NULL,
          email VARCHAR(100) NULL,
          bio TEXT NULL,
          display_order INTEGER DEFAULT 0,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          event_date DATE NOT NULL,
          event_time VARCHAR(100) NOT NULL,
          venue VARCHAR(255) NOT NULL,
          category VARCHAR(100) DEFAULT 'General',
          cover_image VARCHAR(255) NULL,
          registration_link VARCHAR(255) NULL,
          status TEXT DEFAULT 'Upcoming',
          is_featured INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS event_gallery (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_id INTEGER NOT NULL,
          image_url VARCHAR(255) NOT NULL,
          FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS gallery (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title VARCHAR(255) NULL,
          category VARCHAR(100) DEFAULT 'General',
          album_name VARCHAR(100) DEFAULT 'General',
          media_type TEXT DEFAULT 'image',
          media_url VARCHAR(255) NOT NULL,
          thumbnail_url VARCHAR(255) NULL,
          created_at DATETIME DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS sponsors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL,
          logo_url VARCHAR(255) NOT NULL,
          website VARCHAR(255) NULL,
          category VARCHAR(100) DEFAULT 'Bronze',
          priority INTEGER DEFAULT 0,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS volunteers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL,
          mobile VARCHAR(20) NOT NULL,
          email VARCHAR(100) NOT NULL,
          address TEXT NULL,
          skills VARCHAR(255) NULL,
          status TEXT DEFAULT 'Pending',
          created_at DATETIME DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS contact_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          subject VARCHAR(255) NULL,
          message TEXT NOT NULL,
          reply_status TEXT DEFAULT 'Unread',
          created_at DATETIME DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS news (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
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
          created_at DATETIME DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS visitor_stats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          visit_date DATE NOT NULL UNIQUE,
          hits INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS event_registrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_id INTEGER NOT NULL,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          tickets INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT (datetime('now')),
          FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
        );
      `);
      console.log('✅ SQLite database tables initialized.');
    }

    // ─── Seed Data ─────────────────────────────────────────────────────────────
    
    // Seed default superadmin user
    const [adminRows] = await pool.query("SELECT COUNT(*) as count FROM users WHERE username = ?", ['superadmin']);
    const adminCount = adminRows[0].count || adminRows[0]['COUNT(*)'] || 0;
    if (adminCount === 0) {
      const passHash = await bcrypt.hash('admin@123', 10);
      await pool.query("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)", [
        'superadmin', 'superadmin@vikrin.org', passHash, 'Super Admin'
      ]);
      console.log('🌱 Seeded default superadmin.');
    }

    // Seed hero slides
    const [heroRows] = await pool.query("SELECT COUNT(*) as count FROM hero_slides");
    const heroCount = heroRows[0].count || heroRows[0]['COUNT(*)'] || 0;
    if (heroCount === 0) {
      const slides = [
        ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819', 'Grand Celebration 2026', 'Experience the Ultimate Cultural Festival', 'Join thousands of attendees in celebrating music, art, culture, and community. Discover live performances, interactive workshops, and delicious culinary experiences.', 'Explore Events', '/events', 'Become a Volunteer', '/volunteer', 1],
        ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30', 'Live Music & Performances', 'Unforgettable Nights & Vibrant Energy', 'Feel the rhythm of top artists and cultural performers on spectacular stages with immersive sound and visual design.', 'View Schedule', '/events', 'Our Gallery', '/gallery', 2],
        ['https://images.unsplash.com/photo-1533174072545-7a4b2a786c06', 'Community & Heritage', 'Celebrating Unity, Traditions & Creativity', 'A grand gathering bringing together diverse communities, local artisans, and creative storytellers.', 'Learn More', '/about', 'Contact Us', '/contact', 3]
      ];
      for (const s of slides) {
        await pool.query(`INSERT INTO hero_slides 
          (image_url, badge, heading, description, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, display_order) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, s);
      }
      console.log('🌱 Seeded hero slides.');
    }

    // Seed Events
    const [eventRows] = await pool.query("SELECT COUNT(*) as count FROM events");
    const eventCount = eventRows[0].count || eventRows[0]['COUNT(*)'] || 0;
    if (eventCount === 0) {
      const events = [
        ['Grand Ganesh Chaturthi Utsav 2026', '2026-09-14', '08:00 AM - 11:30 PM', 'Vikrin Community Center Ground, Mumbai', 'Cultural', 'Join us for the 25th Silver Jubilee celebrations of our Ganesh Utsav. Expect grand decorations, daily cultural events, community feasts, and special performances.', 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600&auto=format&fit=crop', 'Upcoming'],
        ['Youth Leadership & Social Action Summit', '2026-08-10', '10:00 AM - 05:00 PM', 'Senate Hall, Vikrin Plaza', 'Youth Wing', 'A platform bringing together dynamic young minds to discuss sustainable community solutions, local governance, and digital volunteering strategies.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop', 'Upcoming'],
        ['Mega Blood Donation & Health Camp', '2026-07-28', '09:00 AM - 04:00 PM', 'Vikrin School Hall', 'Social Service', 'Annual healthcare drive organized in association with Vikrin Rotary Club. Free health check-up, blood typing, and donation drive.', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop', 'Upcoming'],
        ['Dahi Handi Cultural Championship', '2025-08-20', '04:00 PM - 09:00 PM', 'Vikrin Central Circle', 'Cultural', 'Relive the high energy Dahi Handi celebration with teams competing from across the district. Prizes for team discipline, height, and speed.', 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=600&auto=format&fit=crop', 'Past']
      ];
      for (const e of events) {
        await pool.query(`INSERT INTO events (title, event_date, event_time, venue, category, description, cover_image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, e);
      }
      console.log('🌱 Seeded default events.');
    }

    // Seed Committee Members
    const [commRows] = await pool.query("SELECT COUNT(*) as count FROM committee_members");
    const commCount = commRows[0].count || commRows[0]['COUNT(*)'] || 0;
    if (commCount === 0) {
      const members = [
        ['Shree Vikranth Patil', 'Chief President', 'Executive Committee', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop', 'Leading the trust for 12 years with a vision of digitalizing community heritage.', 'president@vikrin.org'],
        ['Aishwarya Deshmukh', 'Vice President & Head of Youth Wing', 'Youth Committee', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop', 'Promoting youth active citizenship and establishing leadership initiatives.', 'youth@vikrin.org'],
        ['Rajesh Nair', 'General Secretary', 'Executive Committee', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop', 'Handling overall operations, legal compliance, and strategic alliances.', 'secretary@vikrin.org'],
        ['Dr. Amit Sharma', 'Treasurer & Auditor', 'Finance & Trust', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', 'Ensuring transparent financial governance, auditing, and donation management.', 'finance@vikrin.org']
      ];
      for (const m of members) {
        await pool.query(`INSERT INTO committee_members (name, position, department, photo_url, bio, email) VALUES (?, ?, ?, ?, ?, ?)`, m);
      }
      console.log('🌱 Seeded committee members.');
    }

    // Seed Gallery
    const [galRows] = await pool.query("SELECT COUNT(*) as count FROM gallery");
    const galleryCount = galRows[0].count || galRows[0]['COUNT(*)'] || 0;
    if (galleryCount === 0) {
      const gallery = [
        ['Visarjan Miravnuk (Grand Procession)', 'Festivals', 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=800&auto=format&fit=crop'],
        ['Maha Aarti - Devotees Gathering', 'Festivals', 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=800&auto=format&fit=crop'],
        ['Youth Volunteer Orientation Meet', 'Community', 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop'],
        ['Distribution of Food Kits to Families', 'Social Work', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop'],
        ['Cultural Dance Competition Winners', 'Cultural', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop'],
        ['Free Cardiac Camp Consultation', 'Social Work', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop']
      ];
      for (const g of gallery) {
        await pool.query(`INSERT INTO gallery (title, category, media_url) VALUES (?, ?, ?)`, g);
      }
      console.log('🌱 Seeded gallery items.');
    }

    // Seed Sponsors
    const [sponsorRows] = await pool.query("SELECT COUNT(*) as count FROM sponsors");
    const sponsorCount = sponsorRows[0].count || sponsorRows[0]['COUNT(*)'] || 0;
    if (sponsorCount === 0) {
      const sponsors = [
        ['Vikrin Group Corporate', 'Gold', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop', '#'],
        ['Standard Bank India', 'Gold', 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=300&auto=format&fit=crop', '#'],
        ['Aura Digital Labs', 'Silver', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300&auto=format&fit=crop', '#'],
        ['Apex Builders & Realtors', 'Silver', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&auto=format&fit=crop', '#'],
        ['Vanguard Healthcare', 'Bronze', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=300&auto=format&fit=crop', '#'],
        ['Hindustan Sweet Mart', 'Bronze', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop', '#']
      ];
      for (const s of sponsors) {
        await pool.query(`INSERT INTO sponsors (name, category, logo_url, website) VALUES (?, ?, ?, ?)`, s);
      }
      console.log('🌱 Seeded sponsors.');
    }

    // Seed News
    const [newsRows] = await pool.query("SELECT COUNT(*) as count FROM news");
    const newsCount = newsRows[0].count || newsRows[0]['COUNT(*)'] || 0;
    if (newsCount === 0) {
      const news = [
        ['Vikrin Trust announces environment-friendly Shadu Clay Idol initiative', 'shadu-clay-initiative', 'Press Release', 'Shree Vikranth Patil', 'Continuing our commitment to nature conservation, this year we are conducting workshops to help families build eco-friendly Ganesh idols.', 'The Vikrin Community Platform today formally declared that it will sponsor free training for making Shadu Mati (clay) Ganesha idols. This project is aimed to mitigate chemical pollution during immersion ceremonies.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop', '2026-07-22'],
        ['Over 300 Liters of Blood Collected in Vikrin\'s Monsoon Health Camp', 'monsoon-health-camp', 'Community Activity', 'Aishwarya Deshmukh', 'The collaborative blood donation drive received stellar feedback, with youngsters and senior citizens contributing to regional blood banks.', 'Our latest health checkup drive collected hundreds of units of blood for the Red Cross Society. Over 450 citizens came down to Vikrin School Hall for testing.', 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=600&auto=format&fit=crop', '2026-07-15'],
        ['Digital Platform Launch: Empowering Grassroots Organizations', 'digital-platform-launch', 'Technology', 'Rajesh Nair', 'Vikrin rolls out its official digital directory, allowing committees, donors, and volunteers to connect in real-time.', 'We are proud to announce the Phase 1 launch of the Vikrin Community Platform. Built with modern React and Material UI libraries, the system introduces a consolidated calendar and volunteer roster.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop', '2026-07-01']
      ];
      for (const n of news) {
        await pool.query(`INSERT INTO news (title, slug, category, author, summary, content, featured_image, publish_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, n);
      }
      console.log('🌱 Seeded news articles.');
    }

    // Seed About Timeline
    const [timelineRows] = await pool.query("SELECT COUNT(*) as count FROM about_timeline");
    const timelineCount = timelineRows[0].count || timelineRows[0]['COUNT(*)'] || 0;
    if (timelineCount === 0) {
      const timeline = [
        ['2001', 'The Founding Stone', 'Established as a small circle of 10 youths to coordinate local Ganesh Chaturthi decorations in the central square.', 1],
        ['2007', 'Trust Registration', 'Formally registered as Vikrin Community Welfare Trust, expanding activities into education aids for orphanages.', 2],
        ['2013', 'First Mega Festival Arena', 'Acquired the Central Ground, accommodating over 10,000 devotees daily during regional festivals.', 3],
        ['2019', 'Disaster Relief Front', 'Mobilized over 1,200 volunteers to assist in state-wide flood rehabilitation, distributing 20+ tons of essential supplies.', 4],
        ['2026', 'Digital Vikrin Hub Launch', 'Migrated operations to a unified SaaS community platform to digitalize memberships, volunteer coordination, and sponsorships.', 5]
      ];
      for (const t of timeline) {
        await pool.query(`INSERT INTO about_timeline (year, title, description, display_order) VALUES (?, ?, ?, ?)`, t);
      }
      console.log('🌱 Seeded about timeline.');
    }

    console.log('✅ Database initialization completed successfully.');
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
  }
}

export default pool;
