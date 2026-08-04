import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_festival_hub_jwt_key_2026';

export function getAuthUser(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  try {
    const decoded = jwt.verify(parts[1], JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

export function requireAuth(allowedRoles = ['Super Admin', 'Admin', 'Editor']) {
  return (req, res, next) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        data: null
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Insufficient permissions',
        data: null
      });
    }

    req.user = user;
    next();
  };
}
