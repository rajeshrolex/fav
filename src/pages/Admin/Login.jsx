import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, TextField, Typography, Button, Paper, Container, Stack, useTheme } from '@mui/material';
import { Lock, User, KeyRound, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, login, forgotPassword, resetPassword } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);
  
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMode, setResetMode] = useState(false); // true if user has token and is resetting
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await login(data.username, data.password);
      if (res.success) {
        navigate('/admin');
      } else {
        toast.error(res.message || 'Invalid username or password');
      }
    } catch (err) {
      toast.error('An error occurred during login');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setSubmitting(true);
    try {
      const res = await forgotPassword(forgotEmail);
      if (res.success) {
        toast.success(res.message);
        // Print reset token in console/toast for easy offline copy
        if (res.data && res.data.reset_token) {
          console.log("Password Reset Token:", res.data.reset_token);
          toast(`Your reset token is: ${res.data.reset_token}`, {
            duration: 10000,
            icon: '🔑',
          });
          setResetToken(res.data.reset_token);
        }
        setResetMode(true);
      }
    } catch (err) {
      // Toast shown by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetToken || !newPassword) return;
    setSubmitting(true);
    try {
      const res = await resetPassword(resetToken, newPassword);
      if (res.success) {
        setShowForgot(false);
        setResetMode(false);
        setForgotEmail('');
        setResetToken('');
        setNewPassword('');
      }
    } catch (err) {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', px: 2 }}>
      <Container maxWidth="xs">
        <Paper 
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            borderRadius: 5,
            border: '1px solid',
            borderColor: 'divider',
            background: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(17, 27, 53, 0.6)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}
        >
          {/* Logo badge */}
          <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: 'primary.main', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', mb: 3 }}>
            <Lock size={28} />
          </Box>
          
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
            Admin Portal
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to manage your website content and registry.
          </Typography>

          {!showForgot ? (
            // LOGIN FORM
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Controller
                name="username"
                control={control}
                rules={{ required: 'Username or Email is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Username or Email"
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <Box sx={{ color: 'text.secondary', mr: 1, display: 'flex', alignItems: 'center' }}>
                            <User size={18} />
                          </Box>
                        ),
                      }
                    }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{ required: 'Password is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <Box sx={{ color: 'text.secondary', mr: 1, display: 'flex', alignItems: 'center' }}>
                            <KeyRound size={18} />
                          </Box>
                        ),
                      }
                    }}
                  />
                )}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
                <Button 
                  variant="text" 
                  size="small" 
                  onClick={() => setShowForgot(true)}
                  sx={{ fontWeight: 700 }}
                >
                  Forgot Password?
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
              >
                {submitting ? 'Authenticating...' : 'Sign In'}
              </Button>
            </Box>
          ) : (
            // FORGOT PASSWORD FORM
            <Box>
              {!resetMode ? (
                <Box component="form" onSubmit={handleForgotSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left', mb: 1 }}>
                    Enter your registered email address. We will generate a password reset token to proceed.
                  </Typography>
                  <TextField
                    label="Email Address"
                    type="email"
                    required
                    fullWidth
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={submitting}
                    sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
                  >
                    {submitting ? 'Generating Token...' : 'Generate Reset Token'}
                  </Button>

                  <Button 
                    variant="text" 
                    fullWidth
                    onClick={() => setShowForgot(false)}
                    sx={{ fontWeight: 700 }}
                  >
                    Back to Login
                  </Button>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleResetSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left', mb: 1 }}>
                    Enter the reset token that was generated for your email and set your new password.
                  </Typography>
                  <TextField
                    label="Reset Token"
                    required
                    fullWidth
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    required
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={submitting}
                    sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
                  >
                    {submitting ? 'Resetting Password...' : 'Change Password'}
                  </Button>

                  <Button 
                    variant="text" 
                    fullWidth
                    onClick={() => {
                      setResetMode(false);
                      setResetToken('');
                    }}
                    sx={{ fontWeight: 700 }}
                  >
                    Back to Email entry
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
