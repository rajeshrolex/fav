-- ============================================================================
-- Festival Hub — Complete MySQL Database Schema
-- Compatible with: MySQL 5.7+ / MariaDB 10.3+
-- Hostinger Shared Hosting / cPanel / phpMyAdmin
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `u882069120_FAV`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `u882069120_FAV`;

SET FOREIGN_KEY_CHECKS = 0;

-- ── Users (Authentication & Roles) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
    `id`                   INT            AUTO_INCREMENT PRIMARY KEY,
    `username`             VARCHAR(50)    NOT NULL UNIQUE,
    `email`                VARCHAR(100)   NOT NULL UNIQUE,
    `password_hash`        VARCHAR(255)   NOT NULL,
    `role`                 ENUM('Super Admin','Admin','Editor') DEFAULT 'Super Admin',
    `reset_token`          VARCHAR(255)   NULL DEFAULT NULL,
    `reset_token_expires`  DATETIME       NULL DEFAULT NULL,
    `created_at`           TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    `updated_at`           TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Site Settings (Key-Value Store) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `settings` (
    `key_name`   VARCHAR(150)  NOT NULL PRIMARY KEY,
    `key_value`  TEXT          NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Page-Level SEO Settings ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `seo_pages` (
    `page_name`           VARCHAR(50)   NOT NULL PRIMARY KEY,
    `meta_title`          VARCHAR(255)  NULL,
    `meta_description`    TEXT          NULL,
    `meta_keywords`       TEXT          NULL,
    `og_title`            VARCHAR(255)  NULL,
    `og_description`      TEXT          NULL,
    `og_image`            VARCHAR(500)  NULL,
    `twitter_title`       VARCHAR(255)  NULL,
    `twitter_description` TEXT          NULL,
    `twitter_image`       VARCHAR(500)  NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Hero Banner Slides ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `hero_slides` (
    `id`                  INT           AUTO_INCREMENT PRIMARY KEY,
    `image_url`           VARCHAR(500)  NOT NULL,
    `badge`               VARCHAR(255)  NULL,
    `heading`             VARCHAR(255)  NOT NULL,
    `description`         TEXT          NULL,
    `primary_btn_text`    VARCHAR(100)  NULL,
    `primary_btn_link`    VARCHAR(500)  NULL,
    `secondary_btn_text`  VARCHAR(100)  NULL,
    `secondary_btn_link`  VARCHAR(500)  NULL,
    `display_order`       INT           DEFAULT 0,
    `created_at`          TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`          TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── About Page Timeline / Festival History ───────────────────────────────────
-- NOTE: This table is shared between the About page timeline and the
--       Festival History page. Both modules read/write to this single table.
CREATE TABLE IF NOT EXISTS `about_timeline` (
    `id`            INT          AUTO_INCREMENT PRIMARY KEY,
    `year`          VARCHAR(10)  NOT NULL,
    `title`         VARCHAR(255) NOT NULL,
    `description`   TEXT         NOT NULL,
    `display_order` INT          DEFAULT 0,
    `created_at`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Committee Members ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `committee_members` (
    `id`            INT          AUTO_INCREMENT PRIMARY KEY,
    `name`          VARCHAR(100) NOT NULL,
    `position`      VARCHAR(100) NOT NULL,
    `department`    VARCHAR(100) NULL,
    `photo_url`     VARCHAR(500) NULL,
    `mobile`        VARCHAR(20)  NULL,
    `email`         VARCHAR(100) NULL,
    `bio`           TEXT         NULL,
    `display_order` INT          DEFAULT 0,
    `is_active`     TINYINT(1)   DEFAULT 1,
    `created_at`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Events ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `events` (
    `id`                INT           AUTO_INCREMENT PRIMARY KEY,
    `title`             VARCHAR(255)  NOT NULL,
    `description`       TEXT          NOT NULL,
    `event_date`        DATE          NOT NULL,
    `event_time`        VARCHAR(100)  NOT NULL,
    `venue`             VARCHAR(255)  NOT NULL,
    `category`          VARCHAR(100)  DEFAULT 'General',
    `cover_image`       VARCHAR(500)  NULL,
    `registration_link` VARCHAR(500)  NULL,
    `status`            ENUM('Upcoming','Past','Cancelled') DEFAULT 'Upcoming',
    `is_featured`       TINYINT(1)    DEFAULT 0,
    `created_at`        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Event Gallery (Sub-images per Event) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS `event_gallery` (
    `id`        INT          AUTO_INCREMENT PRIMARY KEY,
    `event_id`  INT          NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Event Registrations ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `event_registrations` (
    `id`         INT          AUTO_INCREMENT PRIMARY KEY,
    `event_id`   INT          NOT NULL,
    `name`       VARCHAR(100) NOT NULL,
    `email`      VARCHAR(100) NOT NULL,
    `phone`      VARCHAR(20)  NOT NULL,
    `tickets`    INT          DEFAULT 1,
    `created_at` TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Main Gallery (Photos & Videos) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `gallery` (
    `id`            INT           AUTO_INCREMENT PRIMARY KEY,
    `title`         VARCHAR(255)  NULL,
    `category`      VARCHAR(100)  DEFAULT 'General',
    `album_name`    VARCHAR(100)  DEFAULT 'General',
    `media_type`    ENUM('image','video') DEFAULT 'image',
    `media_url`     VARCHAR(500)  NOT NULL,
    `thumbnail_url` VARCHAR(500)  NULL,
    `created_at`    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Sponsors ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `sponsors` (
    `id`         INT           AUTO_INCREMENT PRIMARY KEY,
    `name`       VARCHAR(100)  NOT NULL,
    `logo_url`   VARCHAR(500)  NOT NULL,
    `website`    VARCHAR(500)  NULL,
    `category`   VARCHAR(100)  DEFAULT 'Bronze', -- Gold, Silver, Bronze, Platinum
    `priority`   INT           DEFAULT 0,
    `is_active`  TINYINT(1)    DEFAULT 1,
    `created_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Volunteer Registrations ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `volunteers` (
    `id`         INT           AUTO_INCREMENT PRIMARY KEY,
    `name`       VARCHAR(100)  NOT NULL,
    `mobile`     VARCHAR(20)   NOT NULL,
    `email`      VARCHAR(100)  NOT NULL,
    `address`    TEXT          NULL,
    `skills`     VARCHAR(500)  NULL,
    `status`     ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    `created_at` TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Contact Form Submissions ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `contact_messages` (
    `id`           INT           AUTO_INCREMENT PRIMARY KEY,
    `name`         VARCHAR(100)  NOT NULL,
    `email`        VARCHAR(100)  NOT NULL,
    `subject`      VARCHAR(255)  NULL,
    `message`      TEXT          NOT NULL,
    `reply_status` ENUM('Unread','Read','Replied') DEFAULT 'Unread',
    `created_at`   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── News / Blog ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `news` (
    `id`               INT           AUTO_INCREMENT PRIMARY KEY,
    `title`            VARCHAR(255)  NOT NULL,
    `slug`             VARCHAR(255)  NOT NULL UNIQUE,
    `category`         VARCHAR(100)  NULL,
    `author`           VARCHAR(100)  NULL,
    `summary`          TEXT          NULL,
    `content`          LONGTEXT      NOT NULL,
    `featured_image`   VARCHAR(500)  NULL,
    `publish_date`     DATE          NOT NULL,
    `meta_title`       VARCHAR(255)  NULL,
    `meta_description` TEXT          NULL,
    `created_at`       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Visitor Stats (Simple Daily Counter) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS `visitor_stats` (
    `id`         INT   AUTO_INCREMENT PRIMARY KEY,
    `visit_date` DATE  NOT NULL UNIQUE,
    `hits`       INT   DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Default Admin User
-- Username: superadmin
-- Password: Admin@2026 (bcrypt hash)
-- Change this password after first login via Settings → Change Password
INSERT IGNORE INTO `users` (`username`, `email`, `password_hash`, `role`)
VALUES (
    'superadmin',
    'admin@vikrin.org',
    '$2y$12$2g69PSAsLadeZw7LedWNeO8ThdcUjfHS534pKhowYyL5h1lxvc49y',
    'Super Admin'
);

-- Default Site Settings
INSERT IGNORE INTO `settings` (`key_name`, `key_value`) VALUES
    ('site_name',             'Vikrin Community Hub'),
    ('site_tagline',          'Celebrating Culture, Tradition & Community'),
    ('site_email',            'info@vikrin.org'),
    ('site_phone',            '+91 98765 43210'),
    ('site_address',          'Vikrin Community Center, Tamil Nadu, India'),
    ('theme_mode',            'light'),
    ('theme_primary',         '#1E40AF'),
    ('theme_secondary',       '#7C3AED'),
    ('footer_text',           '© 2026 Vikrin Community Hub. All Rights Reserved.'),
    ('social_facebook',       ''),
    ('social_instagram',      ''),
    ('social_twitter',        ''),
    ('social_youtube',        ''),
    ('about_preview_title',   'About Vikrin Community'),
    ('about_preview_subtitle','Our Story, Mission & Values'),
    ('about_preview_text1',   'We are a vibrant community organization dedicated to celebrating culture and tradition.'),
    ('about_preview_text2',   'Through festivals, events, and social service, we bring people together.'),
    ('about_preview_mission', 'To foster unity, preserve culture, and serve the community.'),
    ('about_preview_vision',  'A harmonious community celebrating its heritage while embracing the future.');

-- Default SEO Pages
INSERT IGNORE INTO `seo_pages` (`page_name`, `meta_title`, `meta_description`) VALUES
    ('home',     'Vikrin Community Hub — Celebrating Culture & Tradition', 'Official website of Vikrin Community Hub. Discover our festivals, events, committee, and news.'),
    ('about',    'About Us — Vikrin Community Hub', 'Learn about the history, mission, and vision of Vikrin Community Hub.'),
    ('events',   'Events — Vikrin Community Hub', 'Explore upcoming and past cultural events organized by Vikrin Community Hub.'),
    ('gallery',  'Gallery — Vikrin Community Hub', 'View photos and videos from our festivals and cultural events.'),
    ('news',     'News — Vikrin Community Hub', 'Stay updated with the latest news and announcements from Vikrin Community Hub.'),
    ('contact',  'Contact Us — Vikrin Community Hub', 'Get in touch with Vikrin Community Hub for inquiries and collaboration.'),
    ('sponsors', 'Our Sponsors — Vikrin Community Hub', 'We thank our sponsors and partners for their generous support.'),
    ('volunteer','Volunteer — Vikrin Community Hub', 'Join our volunteer team and contribute to community events.');
