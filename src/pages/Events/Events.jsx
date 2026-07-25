import React, { useState, useEffect } from 'react';
import { Box, Grid, Tabs, Tab, TextField, InputAdornment, Button, Typography, Paper, useTheme, Card, CardContent } from '@mui/material';
import { Search, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { EventCard } from '../../components/cards/Cards';
import { upcomingEvents } from '../../constants/mockData';
import { Modal } from '../../components/common/Modals';
import { PrimaryButton } from '../../components/common/Buttons';
import toast from 'react-hot-toast';

const Events = () => {
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [catFilter, setCatFilter] = useState(0);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const categories = ['All', 'Cultural', 'Youth Wing', 'Social Service'];

  // Check URL parameter for open event
  useEffect(() => {
    const eventId = searchParams.get('id');
    if (eventId) {
      const match = upcomingEvents.find(e => e.id === eventId);
      if (match) {
        setSelectedEvent(match);
      }
    }
  }, [searchParams]);

  const handleCatChange = (event, newValue) => {
    setCatFilter(newValue);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    toast.success(`Successfully registered for "${selectedEvent.title}"! We will email you the pass.`, {
      duration: 5000,
      icon: '🎉',
    });
    setIsRegisterOpen(false);
  };

  // Filtering Logic
  const filteredEvents = upcomingEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) || 
                          event.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || event.status === statusFilter;
    
    const matchesCat = catFilter === 0 || event.category === categories[catFilter];

    return matchesSearch && matchesStatus && matchesCat;
  });

  return (
    <Box>
      <SEO
        title="Community Events Registry"
        description="Filter and register for cultural programs, religious assemblies, health camps, and volunteer drives."
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
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Box onClick={() => setSelectedEvent(event)} sx={{ cursor: 'pointer' }}>
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
                  <Typography variant="body2">{selectedEvent.date}</Typography>
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
                <PrimaryButton onClick={() => setIsRegisterOpen(true)} fullWidth sx={{ py: 1.5 }}>
                  Register for this Event
                </PrimaryButton>
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
            <TextField label="Full Name" required fullWidth />
            <TextField label="Email Address" required type="email" fullWidth />
            <TextField label="Phone Number" required fullWidth />
            <TextField label="Ticket Count" required type="number" defaultValue="1" InputProps={{ inputProps: { min: 1, max: 5 } }} fullWidth />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button onClick={() => setIsRegisterOpen(false)} variant="outlined" fullWidth>
                Cancel
              </Button>
              <PrimaryButton type="submit" fullWidth>
                Submit Form
              </PrimaryButton>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default Events;
