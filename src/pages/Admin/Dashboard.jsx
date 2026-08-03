import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, IconButton, Paper, Divider, Stack, Avatar } from '@mui/material';
import { 
  Users, Calendar, Heart, Shield, Eye, Bell, ArrowRight, Check, X, Mail 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [latestVolunteers, setLatestVolunteers] = useState([]);
  const [latestMessages, setLatestMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard.php');
      if (res.success && res.data) {
        setStats(res.data.stats || {});
        setLatestVolunteers(res.data.recentVolunteers || res.data.latest_volunteers || []);
        setLatestMessages(res.data.recentMessages || res.data.latest_messages || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApproveVolunteer = async (id, status) => {
    try {
      const res = await api.post(`/volunteers.php?action=status`, { id, status });
      if (res.success) {
        toast.success(`Volunteer status updated to ${status}`);
        fetchDashboardData();
      }
    } catch (err) {
      // Toast shown by interceptor
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography>Loading CMS metrics...</Typography>
      </Box>
    );
  }

  const statCards = [
    { label: 'Total Page Hits', value: stats.visitors ?? stats.total_hits ?? 0, icon: <Eye size={22} />, color: 'primary.main' },
    { label: 'Upcoming Events', value: stats.events ?? stats.total_events ?? 0, icon: <Calendar size={22} />, color: 'success.main' },
    { label: 'Gallery Images', value: stats.gallery ?? stats.total_gallery ?? 0, icon: <Shield size={22} />, color: 'info.main' },
    { label: 'Total Volunteers', value: stats.volunteers ?? stats.total_volunteers ?? 0, icon: <Heart size={22} />, color: 'error.main' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: '1.75rem', mb: 0.5 }}>
            Welcome Back!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here is the current platform status and recent notifications.
          </Typography>
        </Box>
      </Box>

      {/* Grid of Stats Cards */}
      <Grid container spacing={3.5} sx={{ mb: 5 }}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '2rem' }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(245, 124, 0, 0.06)', color: card.color }}>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Column 1: Latest Volunteer Applications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Users size={18} className="text-orange-500" /> Pending Volunteers
              </Typography>
              <Button component={Link} to="/admin/volunteers" size="small" endIcon={<ArrowRight size={14} />}>
                View All
              </Button>
            </Box>

            <Stack spacing={2} divider={<Divider />}>
              {latestVolunteers.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No pending volunteer applications.
                </Typography>
              ) : (
                latestVolunteers.map((vol) => (
                  <Box key={vol.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', fontSize: '0.9rem', width: 36, height: 36 }}>
                        {vol.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{vol.name}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Skills: {vol.skills} | Email: {vol.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" color="success" onClick={() => handleApproveVolunteer(vol.id, 'Approved')}>
                        <Check size={16} />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleApproveVolunteer(vol.id, 'Rejected')}>
                        <X size={16} />
                      </IconButton>
                    </Box>
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Column 2: Latest Messages Inbox */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Mail size={18} className="text-orange-500" /> Recent Contact Messages
              </Typography>
              <Button component={Link} to="/admin/messages" size="small" endIcon={<ArrowRight size={14} />}>
                Inbox
              </Button>
            </Box>

            <Stack spacing={2} divider={<Divider />}>
              {latestMessages.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No messages received yet.
                </Typography>
              ) : (
                latestMessages.map((msg) => (
                  <Box key={msg.id} sx={{ py: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{msg.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'primary.main', mb: 0.5 }}>
                      Subject: {msg.subject}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: '0.8rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4
                      }}
                    >
                      {msg.message}
                    </Typography>
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
