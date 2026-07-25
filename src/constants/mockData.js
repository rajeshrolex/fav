export const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1920&auto=format&fit=crop', // Festive lighting/grandeur
    badge: 'Celebrating Culture & Unity',
    heading: 'Celebrating Culture, Unity & Community',
    description: 'A powerful digital platform for Youth Organizations, Ganesh Utsav Committees, NGOs, Trusts, and Community Associations. Empowering local committees with next-gen digital management tools.',
    primaryBtn: { text: 'Explore Events', link: '/events' },
    secondaryBtn: { text: 'Become a Volunteer', link: '/volunteer' }
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1920&auto=format&fit=crop', // Community gathering/festival
    badge: 'Empowering Youth Leadership',
    heading: 'Driving Positive Social Change',
    description: 'Join our youth wing in organizing charitable camps, leadership summits, and welfare drives. Making an impact, one festival at a time.',
    primaryBtn: { text: 'Join Youth Committee', link: '/committee' },
    secondaryBtn: { text: 'Contact Us', link: '/contact' }
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1920&auto=format&fit=crop', // Elegant cultural event/celebration
    badge: 'Preserving Rich Heritage',
    heading: 'A Legacy of Festival Celebrations',
    description: 'Delve into the historical archives of our community’s grand celebrations, tracing decades of faith, art, and togetherness.',
    primaryBtn: { text: 'Festival History', link: '/festival-history' },
    secondaryBtn: { text: 'Donate Now', link: '/volunteer?action=donate' }
  }
];

export const statistics = [
  { value: '25+', label: 'Years of Legacy', suffix: 'Years' },
  { value: '150+', label: 'Active Committee Members', suffix: '+' },
  { value: '2,500+', label: 'Registered Volunteers', suffix: '+' },
  { value: '50K+', label: 'Annual Attendees', suffix: 'K+' }
];

export const upcomingEvents = [
  {
    id: 'ev-1',
    title: 'Grand Ganesh Chaturthi Utsav 2026',
    date: '2026-09-14',
    time: '08:00 AM - 11:30 PM',
    location: 'Vikrin Community Center Ground, Mumbai',
    category: 'Cultural',
    description: 'Join us for the 25th Silver Jubilee celebrations of our Ganesh Utsav. Expect grand decorations, daily cultural events, community feasts, and special performances.',
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600&auto=format&fit=crop',
    status: 'Upcoming',
    registrationLink: '/events/register/ev-1'
  },
  {
    id: 'ev-2',
    title: 'Youth Leadership & Social Action Summit',
    date: '2026-08-10',
    time: '10:00 AM - 05:00 PM',
    location: 'Senate Hall, Vikrin Plaza',
    category: 'Youth Wing',
    description: 'A platform bringing together dynamic young minds to discuss sustainable community solutions, local governance, and digital volunteering strategies.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
    status: 'Upcoming',
    registrationLink: '/events/register/ev-2'
  },
  {
    id: 'ev-3',
    title: 'Mega Blood Donation & Health Camp',
    date: '2026-07-28',
    time: '09:00 AM - 04:00 PM',
    location: 'Vikrin School Hall',
    category: 'Social Service',
    description: 'Annual healthcare drive organized in association with Vikrin Rotary Club. Free health check-up, blood typing, and donation drive.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop',
    status: 'Upcoming',
    registrationLink: '/events/register/ev-3'
  },
  {
    id: 'ev-4',
    title: 'Dahi Handi Cultural Championship',
    date: '2025-08-20',
    time: '04:00 PM - 09:00 PM',
    location: 'Vikrin Central Circle',
    category: 'Cultural',
    description: 'Relive the high energy Dahi Handi celebration with teams competing from across the district. Prizes for team discipline, height, and speed.',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=600&auto=format&fit=crop',
    status: 'Past',
    registrationLink: null
  }
];

export const committeeMembers = [
  {
    id: 'c-1',
    name: 'Shree Vikranth Patil',
    role: 'Chief President',
    department: 'Executive Committee',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
    bio: 'Leading the trust for 12 years with a vision of digitalizing community heritage.',
    socials: { twitter: '#', linkedin: '#', email: 'president@vikrin.org' }
  },
  {
    id: 'c-2',
    name: 'Aishwarya Deshmukh',
    role: 'Vice President & Head of Youth Wing',
    department: 'Youth Committee',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    bio: 'Promoting youth active citizenship and establishing leadership initiatives.',
    socials: { twitter: '#', linkedin: '#', email: 'youth@vikrin.org' }
  },
  {
    id: 'c-3',
    name: 'Rajesh Nair',
    role: 'General Secretary',
    department: 'Executive Committee',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
    bio: 'Handling overall operations, legal compliance, and strategic alliances.',
    socials: { twitter: '#', linkedin: '#', email: 'secretary@vikrin.org' }
  },
  {
    id: 'c-4',
    name: 'Dr. Amit Sharma',
    role: 'Treasurer & Auditor',
    department: 'Finance & Trust',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    bio: 'Ensuring transparent financial governance, auditing, and donation management.',
    socials: { twitter: '#', linkedin: '#', email: 'finance@vikrin.org' }
  }
];

export const sponsors = [
  // Gold Tier
  { id: 'sp-1', name: 'Vikrin Group Corporate', tier: 'Gold', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop', website: '#' },
  { id: 'sp-2', name: 'Standard Bank India', tier: 'Gold', logo: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=300&auto=format&fit=crop', website: '#' },
  // Silver Tier
  { id: 'sp-3', name: 'Aura Digital Labs', tier: 'Silver', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300&auto=format&fit=crop', website: '#' },
  { id: 'sp-4', name: 'Apex Builders & Realtors', tier: 'Silver', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&auto=format&fit=crop', website: '#' },
  // Bronze Tier
  { id: 'sp-5', name: 'Vanguard Healthcare', tier: 'Bronze', logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=300&auto=format&fit=crop', website: '#' },
  { id: 'sp-6', name: 'Hindustan Sweet Mart', tier: 'Bronze', logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop', website: '#' }
];

export const galleryItems = [
  { id: 'g-1', title: 'Visarjan Miravnuk (Grand Procession)', category: 'Festivals', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=800&auto=format&fit=crop' },
  { id: 'g-2', title: 'Maha Aarti - Devotees Gathering', category: 'Festivals', image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=800&auto=format&fit=crop' },
  { id: 'g-3', title: 'Youth Volunteer Orientation Meet', category: 'Community', image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop' },
  { id: 'g-4', title: 'Distribution of Food Kits to Tribal Families', category: 'Social Work', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop' },
  { id: 'g-5', title: 'Cultural Dance Competition Winners', category: 'Cultural', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop' },
  { id: 'g-6', title: 'Free Cardiac Camp Consultation', category: 'Social Work', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop' }
];

export const newsArticles = [
  {
    id: 'n-1',
    title: 'Vikrin Trust announces environment-friendly Shadu Clay Idol initiative',
    date: '2026-07-22',
    category: 'Press Release',
    summary: 'Continuing our commitment to nature conservation, this year we are conducting workshops to help families build and paint eco-friendly Ganesh idols.',
    content: 'The Vikrin Community Platform today formally declared that it will sponsor free training for making Shadu Mati (clay) Ganesha idols. This project is aimed to mitigate chemical pollution during immersion ceremonies. Chief President Shree Vikranth Patil stated that they target distribution of 5,000+ clay idols to local homes.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'n-2',
    title: 'Over 300 Liters of Blood Collected in Vikrin’s Monsoon Health Camp',
    date: '2026-07-15',
    category: 'Community Activity',
    summary: 'The collaborative blood donation drive received stellar feedback, with youngsters and senior citizens contributing to regional blood banks.',
    content: 'Our latest health checkup drive collected hundreds of units of blood for the Red Cross Society. Over 450 citizens came down to Vikrin School Hall for testing. Free diabetes checkups and blood pressure monitors were set up for elders.',
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'n-3',
    title: 'Digital Platform Launch: Empowering Grassroots Organizations',
    date: '2026-07-01',
    category: 'Technology',
    summary: 'Vikrin rolls out its official digital directory, allowing committees, donors, and volunteers to connect in real-time.',
    content: 'We are proud to announce the Phase 1 launch of the Vikrin Community Platform. Built with modern React and Material UI libraries, the system introduces a consolidated calendar, centralized volunteer roster, and donation pipelines.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'
  }
];

export const historyTimeline = [
  { year: '2001', title: 'The Founding Stone', description: 'Established as a small circle of 10 youths to coordinate local Ganesh Chaturthi decorations in the central square.' },
  { year: '2007', title: 'Trust Registration', description: 'Formally registered as Vikrin Community Welfare Trust, expanding activities into education aids for orphanages.' },
  { year: '2013', title: 'First Mega Festival Arena', description: 'Acquired the Central Ground, accommodating over 10,000 devotees daily during regional festivals.' },
  { year: '2019', title: 'Disaster Relief Front', description: 'Mobilized over 1,200 volunteers to assist in state-wide flood rehabilitation, distributing 20+ tons of essential supplies.' },
  { year: '2026', title: 'Digital Vikrin Hub Launch', description: 'Migrated operations to a unified SaaS community platform to digitalize memberships, volunteer coordination, and sponsorships.' }
];

export const volunteerRoles = [
  { value: 'event-management', label: 'Event Management & Crowd Control' },
  { value: 'social-media', label: 'Media & Social Communications' },
  { value: 'decorations', label: 'Festival Design & Decorations' },
  { value: 'medical-support', label: 'Medical Camp & First-Aid Assistance' },
  { value: 'technical', label: 'Technical & Platform Operations' }
];
