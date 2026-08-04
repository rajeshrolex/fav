import React, { useState, useEffect } from 'react';
import { Box, Grid, Tabs, Tab, TextField, InputAdornment, Button, Typography, Paper, useTheme, Card, CardContent } from '@mui/material';
import { Search, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { EventCard } from '../../components/cards/Cards';
import api from '../../services/api';
import { useConfig } from '../../context/ConfigContext';
import { Modal } from '../../components/common/Modals';
import { PrimaryButton } from '../../components/common/Buttons';
import toast from 'react-hot-toast';

const Events = () => {
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const { trackVisit } = useConfig();
  
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [catFilter, setCatFilter] = useState(0);
  const [categories, setCategories] = useState(['All']);
  const [seo, setSeo] = useState(null);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regTickets, setRegTickets] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Fetch events list and page SEO
  const fetchEvents = async () => {
    try {
      // Fetch SEO
      const seoRes = await api.get('/settings.php', { params: { action: 'seo', page: 'events' } });
      if (seoRes.success && seoRes.data) {
        setSeo(seoRes.data);
      }

      // Fetch Events
      const res = await api.get('/events.php');
      if (res.success && res.data) {
        const mapped = res.data.map(e => ({
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.event_date,
          time: e.event_time,
          location: e.venue,
          category: e.category || 'General',
          image: e.cover_image,
          registrationLink: e.registration_link,
          status: e.status,
          isFeatured: e.is_featured
        }));
        setEvents(mapped);

        // Find unique categories
        const cats = ['All'];
        mapped.forEach(e => {
          if (e.category && !cats.includes(e.category)) {
            cats.push(e.category);
          }
        });
        setCategories(cats);

        // Check URL parameter for auto-open
        const eventId = searchParams.get('id');
        if (eventId) {
          const match = mapped.find(e => String(e.id) === String(eventId));
          if (match) {
            setSelectedEvent(match);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    trackVisit();
    fetchEvents();
  }, [searchParams]);

  const handleCatChange = (event, newValue) => {
    setCatFilter(newValue);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/events.php?action=register', {
        event_id: selectedEvent.id,
        name: regName,
        email: regEmail,
        phone: regPhone,
        tickets: regTickets
      });
      if (res.success) {
        setIsRegisterOpen(false);
        // Clear fields
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegTickets(1);
      }
    } catch (err) {
      // error toasted by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  // Filtering Logic
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) || 
                          event.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || event.status === statusFilter;
    
    const matchesCat = catFilter === 0 || event.category === categories[catFilter];

    return matchesSearch && matchesStatus && matchesCat;
  });

  if (loading) {
    return (
      <Box sx={{ py: 15, textAlign: 'center' }}>
        <Typography>Loading community events...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <SEO
        title={seo?.meta_title || "Community Events Registry"}
        description={seo?.meta_description || "Filter and register for cultural programs, religious assemblies, health camps, and volunteer drives."}
        keywords={seo?.meta_keywords}
        ogTitle={seo?.og_title}
        ogDescription={seo?.og_description}
        ogImage={seo?.og_image}
      />
      <PageHeader
        title="Events & Campaigns"
        subtitle="Stay updated and participate in upcoming community programs."
      />

      <SectionWrapper bg="paper">
        {/* Filters Panel */}
        <Paper sx={{ p: 3, mb: 5, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Grid container spacing={3} sx={{ alignItems: 'center' }}>
            {/* Search */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search events by title or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Category tabs */}
            <Grid item xs={12} md={5}>
              <Tabs
                value={catFilter}
                onChange={handleCatChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Event category filters"
              >
                {categories.map((cat, idx) => (
                  <Tab label={cat} key={idx} sx={{ fontWeight: 650 }} />
                ))}
              </Tabs>
            </Grid>

            {/* Status filters */}
            <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 1 }}>
              {['All', 'Upcoming', 'Past'].map((status) => (
                <Button
                  key={status}
                  size="small"
                  variant={statusFilter === status ? 'contained' : 'outlined'}
                  onClick={() => handleStatusChange(status)}
                  sx={{ flexGrow: 1, borderRadius: 2 }}
                >
                  {status}
                </Button>
              ))}
            </Grid>
          </Grid>
        </Paper>

        {/* Events Grid */}
        <Grid container spacing={4}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} md={6} lg={6} xl={4} key={event.id}>
              <Box onClick={() => setSelectedEvent(event)} sx={{ cursor: 'pointer', width: '100%' }}>
                <EventCard event={event} />
              </Box>
            </Grid>
          ))}
        </Grid>

        {filteredEvents.length === 0 && (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h5" color="text.secondary">
              No events found matching your filter criteria.
            </Typography>
          </Box>
        )}
      </SectionWrapper>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
          maxWidth="md"
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={selectedEvent.image}
                alt={selectedEvent.title}
                sx={{
                  width: '100%',
                  maxHeight: 280,
                  objectFit: 'cover',
                  borderRadius: 3,
                  border: '1.5px solid',
                  borderColor: 'divider',
                }}
              />
              
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Calendar size={18} className="text-orange-500" />
                  <Typography variant="body2">{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Clock size={18} />
                  <Typography variant="body2">{selectedEvent.time}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <MapPin size={18} />
                  <Typography variant="body2">{selectedEvent.location}</Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" color="primary" sx={{ fontWeight: 700, mb: 1, display: 'inline-block' }}>
                  {selectedEvent.category} Category
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {selectedEvent.description}
                </Typography>
              </Box>

              {selectedEvent.status === 'Upcoming' ? (
                selectedEvent.registrationLink ? (
                  <PrimaryButton component="a" href={selectedEvent.registrationLink} target="_blank" fullWidth sx={{ py: 1.5, textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                    Register on External Platform
                  </PrimaryButton>
                ) : (
                  <PrimaryButton onClick={() => setIsRegisterOpen(true)} fullWidth sx={{ py: 1.5 }}>
                    Register for this Event
                  </PrimaryButton>
                )
              ) : (
                <Button disabled variant="outlined" fullWidth sx={{ py: 1.5 }}>
                  This Event is Closed
                </Button>
              )}
            </Grid>
          </Grid>
        </Modal>
      )}

      {/* Registration Details Form Modal */}
      {isRegisterOpen && selectedEvent && (
        <Modal
          open={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          title={`Register for ${selectedEvent.title}`}
          maxWidth="xs"
        >
          <Box component="form" onSubmit={handleRegisterSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <TextField 
              label="Full Name" 
              required 
              fullWidth 
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
            />
            <TextField 
              label="Email Address" 
              required 
              type="email" 
              fullWidth 
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
            <TextField 
              label="Phone Number" 
              required 
              fullWidth 
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
            />
            <TextField 
              label="Ticket Count" 
              required 
              type="number" 
              value={regTickets}
              onChange={(e) => setRegTickets(parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 1, max: 5 } }} 
              fullWidth 
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button onClick={() => setIsRegisterOpen(false)} variant="outlined" fullWidth>
                Cancel
              </Button>
              <PrimaryButton type="submit" fullWidth disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Form'}
              </PrimaryButton>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default Events;
