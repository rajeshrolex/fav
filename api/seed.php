<?php
// api/seed.php
header('Content-Type: text/plain; charset=UTF-8');

require_once __DIR__ . '/db.php';

echo "Database driver active: " . $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) . "\n";
$driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);

// Helper function to clear table cleanly regardless of driver
function clearTable($pdo, $table) {
    global $driver;
    try {
        if ($driver === 'sqlite') {
            $pdo->exec("DELETE FROM $table;");
            $pdo->exec("DELETE FROM sqlite_sequence WHERE name='$table';");
        } else {
            $pdo->exec("SET FOREIGN_KEY_CHECKS=0; TRUNCATE TABLE $table; SET FOREIGN_KEY_CHECKS=1;");
        }
    } catch (\Exception $e) {
        $pdo->exec("DELETE FROM $table;");
    }
}

// 1. Insert default admin user
echo "Creating default administrative users...\n";
$passHash = password_hash('admin@123', PASSWORD_DEFAULT);

$stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = 'superadmin'");
$stmt->execute();
if ($stmt->fetchColumn() == 0) {
    $pdo->prepare("INSERT INTO users (username, email, password_hash, role) VALUES ('superadmin', 'superadmin@vikrin.org', ?, 'Super Admin')")->execute([$passHash]);
    echo "Created Super Admin user (username: superadmin, password: admin@123)\n";
} else {
    echo "User 'superadmin' already exists.\n";
}

// 2. Insert settings
echo "Inserting website settings...\n";
$settings = [
    'site_name' => 'Vikrin Community Platform',
    'logo_url' => '/images/logo.png',
    'favicon_url' => '/images/logo.png',
    'footer_text' => 'Empowering local committees with next-gen digital management tools.',
    'copyright' => '© 2026 Vikrin Community Welfare Trust. All rights reserved.',
    'theme_primary' => '#F57C00',
    'theme_secondary' => '#1E293B',
    'theme_mode' => 'light',
    'contact_address' => 'Vikrin Trust Office, Central Square, Dadar, Mumbai - 400014',
    'contact_phone' => '+91 98765 43210',
    'contact_email' => 'info@vikrin.org',
    'about_preview_title' => 'Empowering Community Through Social Action',
    'about_preview_subtitle' => 'OUR FOUNDATION',
    'about_preview_text1' => 'Vikrin Trust was founded in 2001 by a group of passionate youths determined to channel festive energy into social development.',
    'about_preview_text2' => 'We build systems that promote cultural awareness among youngsters while running daily charity operations.',
    'about_preview_mission' => 'To leverage modern digital tools to coordinate cultural festivals, centralize charity pipelines, and build a cohesive database of volunteers.',
    'about_preview_vision' => 'A transparent, digitized community ecosystem where citizens can easily fund local projects and apply for volunteer rosters.'
];

foreach ($settings as $k => $v) {
    if ($driver === 'sqlite') {
        $setStmt = $pdo->prepare("INSERT INTO settings (key_name, key_value) VALUES (?, ?) ON CONFLICT(key_name) DO UPDATE SET key_value=excluded.key_value;");
    } else {
        $setStmt = $pdo->prepare("INSERT INTO settings (key_name, key_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE key_value=VALUES(key_value);");
    }
    $setStmt->execute([$k, $v]);
}
echo "Settings inserted.\n";

// 3. Insert SEO Pages
echo "Inserting default SEO pages...\n";
$seoPages = [
    ['home', 'Celebrating Culture & Unity | Vikrin Community Platform', 'A premium digital platform for Youth Organizations and Ganesh Utsav Committees.', 'community trust, ganesh utsav, volunteer dashboard'],
    ['about', 'About Our Trust | Vikrin Community Platform', 'Learn more about the history, executive team, vision, and social initiatives.', 'about us, community legacy, vision and mission'],
    ['committee', 'Our Committee Members | Vikrin Community Platform', 'Meet the dedicated leaders and members of the Vikrin executive committee.', 'executive committee, board of directors, trust members'],
    ['events', 'Upcoming Community Events | Vikrin Community Platform', 'Register and participate in our upcoming cultural, social, and youth wing events.', 'events calendar, volunteer activities, blood donation camp'],
    ['gallery', 'Photo & Video Gallery | Vikrin Community Platform', 'Explore the moments, celebrations, charity runs, and cultural memories.', 'gallery, photo album, festival images'],
    ['sponsors', 'Our Sponsors & Corporate Partners | Vikrin Community Platform', 'Meet the organizations supporting our cultural and social activities.', 'sponsors, CSR partners, corporate donors'],
    ['volunteer', 'Become a Volunteer | Vikrin Community Platform', 'Join the youth wing. Sign up to help organize festivals and medical campaigns.', 'volunteer registration, sign up, NGO volunteering'],
    ['contact', 'Contact Us | Vikrin Community Platform', 'Get in touch with the Vikrin Welfare Trust office. Location, phone, and email.', 'contact details, map location, email address']
];

foreach ($seoPages as $sp) {
    if ($driver === 'sqlite') {
        $seoStmt = $pdo->prepare("INSERT INTO seo_pages (page_name, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?) ON CONFLICT(page_name) DO UPDATE SET meta_title=excluded.meta_title, meta_description=excluded.meta_description, meta_keywords=excluded.meta_keywords;");
    } else {
        $seoStmt = $pdo->prepare("INSERT INTO seo_pages (page_name, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE meta_title=VALUES(meta_title), meta_description=VALUES(meta_description), meta_keywords=VALUES(meta_keywords);");
    }
    $seoStmt->execute($sp);
}
echo "SEO Pages inserted.\n";

// 4. Hero Slides
echo "Inserting default hero slides...\n";
clearTable($pdo, 'hero_slides');
$heroSlides = [
    ['https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1920', 'Celebrating Culture & Unity', 'Celebrating Culture, Unity & Community', 'A powerful digital platform for Youth Organizations, Ganesh Utsav Committees, NGOs, and Trusts.', 'Explore Events', '/events', 'Become a Volunteer', '/volunteer', 1],
    ['https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1920', 'Empowering Youth Leadership', 'Driving Positive Social Change', 'Join our youth wing in organizing charitable camps, leadership summits, and welfare drives.', 'Join Youth Committee', '/committee', 'Contact Us', '/contact', 2],
    ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1920', 'Preserving Rich Heritage', 'A Legacy of Festival Celebrations', 'Delve into the historical archives of our community’s grand celebrations.', 'Festival History', '/history', 'Donate Now', '/volunteer', 3]
];

$heroStmt = $pdo->prepare("INSERT INTO hero_slides (image_url, badge, heading, description, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);");
foreach ($heroSlides as $hs) {
    $heroStmt->execute($hs);
}
echo "Hero slides seeded.\n";

// 5. Timeline
echo "Inserting timeline...\n";
clearTable($pdo, 'about_timeline');
$timeline = [
    ['2001', 'The Founding Stone', 'Established as a small circle of 10 youths to coordinate local Ganesh Chaturthi decorations.', 1],
    ['2007', 'Trust Registration', 'Formally registered as Vikrin Community Welfare Trust, expanding activities into education aids.', 2],
    ['2013', 'First Mega Festival Arena', 'Acquired the Central Ground, accommodating over 10,000 devotees daily during regional festivals.', 3],
    ['2019', 'Disaster Relief Front', 'Mobilized over 1,200 volunteers to assist in state-wide flood rehabilitation.', 4],
    ['2026', 'Digital Vikrin Hub Launch', 'Migrated operations to a unified SaaS community platform.', 5]
];
$timeStmt = $pdo->prepare("INSERT INTO about_timeline (year, title, description, display_order) VALUES (?, ?, ?, ?);");
foreach ($timeline as $t) {
    $timeStmt->execute($t);
}
echo "Timeline seeded.\n";

// 6. Committee Members
echo "Inserting committee members...\n";
clearTable($pdo, 'committee_members');
$members = [
    ['Shree Vikranth Patil', 'Chief President', 'Executive Committee', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400', '+91 99999 11111', 'president@vikrin.org', 'Leading the trust for 12 years with a vision of digitalizing community heritage.', 1],
    ['Aishwarya Deshmukh', 'Vice President', 'Youth Committee', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400', '+91 99999 22222', 'youth@vikrin.org', 'Promoting youth active citizenship and establishing leadership initiatives.', 2],
    ['Rajesh Nair', 'General Secretary', 'Executive Committee', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400', '+91 99999 33333', 'secretary@vikrin.org', 'Handling overall operations, legal compliance, and strategic alliances.', 3],
    ['Dr. Amit Sharma', 'Treasurer & Auditor', 'Finance & Trust', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400', '+91 99999 44444', 'finance@vikrin.org', 'Ensuring transparent financial governance, auditing, and donation management.', 4]
];
$memStmt = $pdo->prepare("INSERT INTO committee_members (name, position, department, photo_url, mobile, email, bio, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1);");
foreach ($members as $m) {
    $memStmt->execute($m);
}
echo "Committee members seeded.\n";

// 7. Events
echo "Inserting events...\n";
clearTable($pdo, 'events');
$events = [
    ['Grand Ganesh Chaturthi Utsav 2026', 'Join us for the 25th Silver Jubilee celebrations of our Ganesh Utsav. Expect grand decorations, daily cultural events, community feasts, and special performances.', '2026-09-14', '08:00 AM - 11:30 PM', 'Vikrin Community Center Ground, Mumbai', 'Cultural', 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600', '/events/register/ev-1', 'Upcoming', 1],
    ['Youth Leadership & Social Action Summit', 'A platform bringing together dynamic young minds to discuss sustainable community solutions, local governance, and digital volunteering strategies.', '2026-08-10', '10:00 AM - 05:00 PM', 'Senate Hall, Vikrin Plaza', 'Youth Wing', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600', '/events/register/ev-2', 'Upcoming', 0],
    ['Mega Blood Donation & Health Camp', 'Annual healthcare drive organized in association with Vikrin Rotary Club. Free health check-up, blood typing, and donation drive.', '2026-07-28', '09:00 AM - 04:00 PM', 'Vikrin School Hall', 'Social Service', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600', '/events/register/ev-3', 'Upcoming', 0],
    ['Dahi Handi Cultural Championship', 'Relive the high energy Dahi Handi celebration with teams competing from across the district. Prizes for team discipline, height, and speed.', '2025-08-20', '04:00 PM - 09:00 PM', 'Vikrin Central Circle', 'Cultural', 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=600', '', 'Past', 0]
];
$evStmt = $pdo->prepare("INSERT INTO events (title, description, event_date, event_time, venue, category, cover_image, registration_link, status, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");
foreach ($events as $ev) {
    $evStmt->execute($ev);
}
echo "Events seeded.\n";

// 8. Sponsors
echo "Inserting sponsors...\n";
clearTable($pdo, 'sponsors');
$sponsors = [
    ['Vikrin Group Corporate', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300', '#', 'Gold', 1],
    ['Standard Bank India', 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=300', '#', 'Gold', 2],
    ['Aura Digital Labs', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300', '#', 'Silver', 3],
    ['Apex Builders & Realtors', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300', '#', 'Silver', 4],
    ['Vanguard Healthcare', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=300', '#', 'Bronze', 5],
    ['Hindustan Sweet Mart', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300', '#', 'Bronze', 6]
];
$spStmt = $pdo->prepare("INSERT INTO sponsors (name, logo_url, website, category, priority, is_active) VALUES (?, ?, ?, ?, ?, 1);");
foreach ($sponsors as $sp) {
    $spStmt->execute($sp);
}
echo "Sponsors seeded.\n";

// 9. Gallery
echo "Inserting gallery items...\n";
clearTable($pdo, 'gallery');
$gallery = [
    ['Visarjan Miravnuk (Grand Procession)', 'Festivals', 'Ganesh Chaturthi 2025', 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=800'],
    ['Maha Aarti - Devotees Gathering', 'Festivals', 'Ganesh Chaturthi 2025', 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=800'],
    ['Youth Volunteer Orientation Meet', 'Community', 'Youth Seminars', 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800'],
    ['Distribution of Food Kits to Tribal Families', 'Social Work', 'Tribal Aid 2026', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800'],
    ['Cultural Dance Competition Winners', 'Cultural', 'Cultural Fests', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800'],
    ['Free Cardiac Camp Consultation', 'Social Work', 'Health Camp 2026', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800']
];
$galStmt = $pdo->prepare("INSERT INTO gallery (title, category, album_name, media_type, media_url) VALUES (?, ?, ?, 'image', ?);");
foreach ($gallery as $g) {
    $galStmt->execute($g);
}
echo "Gallery seeded.\n";

// 10. News
echo "Inserting news articles...\n";
clearTable($pdo, 'news');
$news = [
    ['Vikrin Trust announces environment-friendly Shadu Clay Idol initiative', 'Press Release', 'Executive Comm.', 'Continuing our commitment to nature conservation, this year we are conducting workshops to help families build eco-friendly Ganesh idols.', '<p>The Vikrin Community Platform today formally declared that it will sponsor free training for making Shadu Mati idols.</p>', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600', '2026-07-22'],
    ['Over 300 Liters of Blood Collected in Vikrin’s Monsoon Health Camp', 'Community Activity', 'Youth Wing Team', 'The collaborative blood donation drive received stellar feedback, with youngsters contributing to regional blood banks.', '<p>Our latest health checkup drive collected hundreds of units of blood for the Red Cross Society.</p>', 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=600', '2026-07-15'],
    ['Digital Platform Launch: Empowering Grassroots Organizations', 'Technology', 'Tech Committee', 'Vikrin rolls out its official digital directory, allowing committees, donors, and volunteers to connect in real-time.', '<p>We are proud to announce the Phase 1 launch of the Vikrin Community Platform.</p>', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600', '2026-07-01']
];
$newsStmt = $pdo->prepare("INSERT INTO news (title, category, author, summary, content, cover_image, publish_date) VALUES (?, ?, ?, ?, ?, ?, ?);");
foreach ($news as $n) {
    $newsStmt->execute($n);
}
echo "News seeded.\n";

// 11. Volunteers
echo "Inserting dummy volunteers...\n";
clearTable($pdo, 'volunteers');
$volunteers = [
    ['Rohan Kulkarni', '+91 98201 12345', 'rohan.k@gmail.com', 'Dadar West, Mumbai', 'Crowd Management, First Aid', 'Pending'],
    ['Priya Deshpande', '+91 98334 56789', 'priya.d@yahoo.com', 'Prabhadevi, Mumbai', 'Event Photography, Social Media', 'Pending'],
    ['Amitabh Joshi', '+91 97690 99887', 'amitabh.j@outlook.com', 'Worli, Mumbai', 'Stage Setup, Audio Systems', 'Approved'],
    ['Sneha Shinde', '+91 99200 44332', 'sneha.s@gmail.com', 'Parel, Mumbai', 'Medical Camp Support, Desk Desk', 'Pending'],
    ['Vikas Verma', '+91 98112 33445', 'vikas.v@gmail.com', 'Matunga, Mumbai', 'Logistics & Transport', 'Pending']
];
$volStmt = $pdo->prepare("INSERT INTO volunteers (name, mobile, email, address, skills, status) VALUES (?, ?, ?, ?, ?, ?);");
foreach ($volunteers as $v) {
    $volStmt->execute($v);
}
echo "Volunteers seeded.\n";

// 12. Contact Messages
echo "Inserting dummy contact messages...\n";
clearTable($pdo, 'contact_messages');
$messages = [
    ['Siddharth Mehta', 'siddharth.m@gmail.com', 'Sponsorship Inquiry for Ganesh Utsav 2026', 'Hello Vikrin Team, We would like to sponsor the upcoming Ganesh Utsav event. Please send us the corporate sponsorship brochure.', 'Unread'],
    ['Kavita Rao', 'kavita.rao@hotmail.com', 'Volunteer Registration Help', 'Hi, I registered as a volunteer last week. How can I confirm my slot for the health camp?', 'Unread'],
    ['Anil Thorat', 'anil.t@gmail.com', 'Cultural Program Booking Request', 'Dear Secretary, our youth group wants to perform a traditional Lezim dance on Day 3 of the festival.', 'Read']
];
$msgStmt = $pdo->prepare("INSERT INTO contact_messages (name, email, subject, message, reply_status) VALUES (?, ?, ?, ?, ?);");
foreach ($messages as $m) {
    $msgStmt->execute($m);
}
echo "Contact messages seeded.\n";

// 13. Visitor Stats
echo "Seeding visitor stats...\n";
clearTable($pdo, 'visitor_stats');
$vStats = [
    [date('Y-m-d'), 245],
    [date('Y-m-d', strtotime('-1 day')), 198],
    [date('Y-m-d', strtotime('-2 days')), 176],
    [date('Y-m-d', strtotime('-3 days')), 210],
    [date('Y-m-d', strtotime('-4 days')), 315]
];
$vStmt = $pdo->prepare("INSERT INTO visitor_stats (visit_date, hits) VALUES (?, ?);");
foreach ($vStats as $vs) {
    $vStmt->execute($vs);
}
echo "Visitor stats seeded.\n";

echo "\nALL DUMMY DATA SEEDED SUCCESSFULLY!\n";
