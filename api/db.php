<?php
// Global CORS and Header configuration
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_file = __DIR__ . '/database.sqlite';

try {
    // Connect to SQLite PDO database
    $pdo = new PDO("sqlite:" . $db_file);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec("PRAGMA journal_mode = WAL;");
    $pdo->exec("PRAGMA foreign_keys = ON;");
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage(),
        'data' => null
    ]);
    exit();
}

// Auto-initialize DB Schema & Seeds if users table does not exist
try {
    $tableCheck = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")->fetch();
    if (!$tableCheck) {
        initDbSchema($pdo);
    }
} catch (Exception $e) {
    // Ignore if already initialized
}

function initDbSchema($pdo) {
    $pdo->exec("
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role TEXT DEFAULT 'Super Admin',
        reset_token VARCHAR(255) NULL,
        reset_token_expires DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sponsors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        logo_url VARCHAR(255) NOT NULL,
        website VARCHAR(255) NULL,
        category VARCHAR(100) DEFAULT 'Bronze',
        priority INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS volunteers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        email VARCHAR(100) NOT NULL,
        address TEXT NULL,
        skills VARCHAR(255) NULL,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NULL,
        message TEXT NOT NULL,
        reply_status TEXT DEFAULT 'Unread',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS history_milestones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year VARCHAR(10) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    ");

    // Seed default superadmin user
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM users WHERE username = 'superadmin'");
    $stmt->execute();
    if ($stmt->fetch()['count'] == 0) {
        $passHash = password_hash('admin@123', PASSWORD_DEFAULT);
        $pdo->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)")
            ->execute(['superadmin', 'superadmin@vikrin.org', $passHash, 'Super Admin']);
    }

    // Seed hero slides
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM hero_slides");
    if ($stmt->fetch()['count'] == 0) {
        $slides = [
            ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819', 'Grand Celebration 2026', 'Experience the Ultimate Cultural Festival', 'Join thousands of attendees in celebrating music, art, culture, and community.', 'Explore Events', '/events', 'Become a Volunteer', '/volunteer', 1],
            ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30', 'Live Music & Performances', 'Unforgettable Nights & Vibrant Energy', 'Feel the rhythm of top artists and cultural performers on spectacular stages.', 'View Schedule', '/events', 'Our Gallery', '/gallery', 2]
        ];
        $insert = $pdo->prepare("INSERT INTO hero_slides (image_url, badge, heading, description, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($slides as $s) {
            $insert->execute($s);
        }
    }

    // Seed events
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM events");
    if ($stmt->fetch()['count'] == 0) {
        $events = [
            ['Grand Ganesh Chaturthi Utsav 2026', '2026-09-14', '08:00 AM - 11:30 PM', 'Vikrin Community Center Ground, Mumbai', 'Cultural', 'Join us for the 25th Silver Jubilee celebrations of our Ganesh Utsav.', 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600&auto=format&fit=crop', 'Upcoming'],
            ['Youth Leadership & Social Action Summit', '2026-08-10', '10:00 AM - 05:00 PM', 'Senate Hall, Vikrin Plaza', 'Youth Wing', 'A platform bringing together dynamic young minds.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop', 'Upcoming']
        ];
        $insert = $pdo->prepare("INSERT INTO events (title, event_date, event_time, venue, category, description, cover_image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($events as $e) {
            $insert->execute($e);
        }
    }

    // Seed settings
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM settings");
    if ($stmt->fetch()['count'] == 0) {
        $settings = [
            ['site_name', 'Vikrin Community Platform'],
            ['contact_email', 'contact@vikrin.org'],
            ['contact_phone', '+91 98765 43210'],
            ['address', 'Vikrin Community Center, Central Avenue, Mumbai, India']
        ];
        $insert = $pdo->prepare("INSERT OR REPLACE INTO settings (key_name, key_value) VALUES (?, ?)");
        foreach ($settings as $st) {
            $insert->execute($st);
        }
    }
}

function json_response($success, $message, $data = null, $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

function get_body() {
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $json = json_decode($raw, true);
        if (is_array($json)) {
            return $json;
        }
    }
    return $_POST;
}

function get_auth_user() {
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : '');
    
    if (!empty($authHeader) && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = $matches[1];
        try {
            $decoded = json_decode(base64_decode($token), true);
            if (is_array($decoded) && isset($decoded['user_id'])) {
                return $decoded;
            }
        } catch (Exception $e) {}
    }
    return null;
}

function generate_token($user) {
    $payload = [
        'user_id' => $user['id'],
        'username' => $user['username'],
        'email' => $user['email'],
        'role' => $user['role'],
        'expires' => time() + 86400
    ];
    return base64_encode(json_encode($payload));
}
