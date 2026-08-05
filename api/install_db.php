<?php
// api/install_db.php — Automatic Database Initializer
require_once __DIR__ . '/../config/config.php';

try {
    $db = getDB();
    $sqlFile = __DIR__ . '/database.sql';
    if (!file_exists($sqlFile)) {
        json_error('SQL file not found');
    }

    $sql = file_get_contents($sqlFile);
    
    // Remove CREATE DATABASE and USE statements since Hostinger handles DB creation
    $sql = preg_replace('/CREATE DATABASE.*?;/is', '', $sql);
    $sql = preg_replace('/USE `.*?`;/is', '', $sql);

    // Execute multi-query
    $db->exec($sql);

    json_success('Database schema initialized and seed data inserted successfully!');
} catch (Exception $e) {
    json_error('Failed to initialize database: ' . $e->getMessage(), 500);
}
