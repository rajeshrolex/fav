import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress } from '@mui/material';
import { Users, Heart, Shield, ArrowUpRight, TrendingUp } from 'lucide-react';
import { PrimaryButton } from '../../components/common/Buttons';

const Dashboard = () => {
  const stats = [
    { title: 'Total Volunteers', value: '2,543', change: '+12% this month', icon: <Users color="#F57C00" size={24} />, bg: 'rgba(245, 124, 0, 0.08)' },
    { title: 'Donations Collected', value: '₹4,82,500', change: '+24% this week', icon: <Heart color="#EF4444" size={24} />, bg: 'rgba(239, 68, 68, 0.08)' },
    { title: 'Active Sponsors', value: '18 Partners', change: '+2 new additions', icon: <Shield color="#3B82F6" size={24} />, bg: 'rgba(59, 130, 246, 0.08)' },
  ];

  const recentRegistrations = [
    { id: '1', name: 'Rohan Sharma', role: 'Event Volunteer', date: 'Just now', status: 'Pending Approval' },
    { id: '2', name: 'Priya Deshmukh', role: 'Medical Camp lead', date: '2 hours ago', status: 'Approved' },
    { id: '3', name: 'Vikram Jadhav', role: 'Decorations committee', date: '1 day ago', status: 'Approved' },
    { id: '4', name: 'Neha Patil', role: 'Social Media editor', date: '3 days ago', status: 'Pending Review' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>Welcome Back, Aishwarya</Typography>
          <Typography variant="body2" color="text.secondary">Here is what is happening at Vikrin Hub today.</Typography>
        </Box>
        <PrimaryButton endIcon={<ArrowUpRight size={16} />}>Export Report</PrimaryButton>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 705 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, my: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUp size={14} color="#10B981" />
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                      {stat.change}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: stat.bg }}>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Grid Table / Progress */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h4" sx={{ fontSize: '1.2rem', fontWeight: 700, mb: 3 }}>
              Recent Volunteer Registrations
            </Typography>
            
            <TableContainer>
              <Table sx={{ minWidth: 600 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Volunteer Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Requested Department</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Applied</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentRegistrations.map((row) => (
                    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                        {row.name}
                      </TableCell>
                      <TableCell>{row.role}</TableCell>
                      <TableCell color="text.secondary">{row.date}</TableCell>
                      <TableCell align="right">
                        <Button 
                          size="small" 
                          variant="text" 
                          color={row.status === 'Approved' ? 'success' : 'warning'}
                          sx={{ fontWeight: 700 }}
                        >
                          {row.status}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="h4" sx={{ fontSize: '1.2rem', fontWeight: 700, mb: 3 }}>
              Fundraising Progress
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Ganesh Decoration Fund</Typography>
                <Typography variant="body2" color="text.secondary">85%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={85} color="primary" sx={{ height: 6, borderRadius: 3 }} />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Youth Summit Fund</Typography>
                <Typography variant="body2" color="text.secondary">60%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={60} color="info" sx={{ height: 6, borderRadius: 3 }} />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Medical Camp Fund</Typography>
                <Typography variant="body2" color="text.secondary">95%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={95} color="success" sx={{ height: 6, borderRadius: 3 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
