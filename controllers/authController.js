import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { getAuthUser } from '../middleware/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_festival_hub_jwt_key_2026';

export async function login(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required', data: null });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
    const user = rows[0];

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const tokenPayload = {
        user_id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: tokenPayload
        }
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid username or password', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Login failed: ${err.message}`, data: null });
  }
}

export async function checkAuth(req, res) {
  const user = getAuthUser(req);
  if (user) {
    return res.json({ success: true, message: 'User is authenticated', data: { user } });
  }
  return res.status(401).json({ success: false, message: 'User is not authenticated', data: null });
}

export async function logout(req, res) {
  return res.json({ success: true, message: 'Logged out successfully', data: null });
}

export async function forgotPassword(req, res) {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required', data: null });
  }

  try {
    const [rows] = await pool.query('SELECT id, username FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const expires = new Date(Date.now() + 3600000); // 1 hour

      await pool.query('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?', [resetToken, expires, rows[0].id]);
      return res.json({
        success: true,
        message: 'Password reset token generated.',
        data: { reset_token: resetToken, email }
      });
    }
    return res.status(404).json({ success: false, message: 'No account associated with this email address', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Error initiating password reset: ${err.message}`, data: null });
  }
}

export async function resetPassword(req, res) {
  const { token, password } = req.body || {};
  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Reset token and new password are required', data: null });
  }

  try {
    const [rows] = await pool.query('SELECT id, reset_token_expires FROM users WHERE reset_token = ?', [token]);
    if (rows.length > 0) {
      const user = rows[0];
      const expiry = new Date(user.reset_token_expires);
      if (expiry > new Date()) {
        const hashed = await bcrypt.hash(password, 10);
        await pool.query('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [hashed, user.id]);
        return res.json({ success: true, message: 'Password reset successful. You can now log in with your new password.', data: null });
      }
    }
    return res.status(400).json({ success: false, message: 'Invalid or expired password reset token', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Reset password failed: ${err.message}`, data: null });
  }
}

export async function changePassword(req, res) {
  const user = getAuthUser(req);
  const { old_password, new_password } = req.body || {};

  if (!old_password || !new_password) {
    return res.status(400).json({ success: false, message: 'Old password and new password are required', data: null });
  }

  try {
    const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [user.user_id]);
    if (rows.length > 0 && (await bcrypt.compare(old_password, rows[0].password_hash))) {
      const hashed = await bcrypt.hash(new_password, 10);
      await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashed, user.user_id]);
      return res.json({ success: true, message: 'Password changed successfully', data: null });
    }
    return res.status(400).json({ success: false, message: 'Incorrect old password', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: `Password update failed: ${err.message}`, data: null });
  }
}
