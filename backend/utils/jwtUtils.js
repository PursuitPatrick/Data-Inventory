const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');

// Ensure env is loaded when this utility is used standalone
// Try project root .env first, then fallback to backend/.env if present
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Generate a signed JWT for a user or arbitrary payload
 * @param {{ id?: number|string, username?: string }|object} payload
 * @param {{ expiresIn?: string|number }} [options]
 * @returns {string}
 */
function generateToken(payload, options = {}) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT secret not configured');
  const jwtOptions = { expiresIn: '1h', ...options };
  return jwt.sign(payload, secret, jwtOptions);
}

/**
 * Verify a JWT and return its decoded payload
 * @param {string} token
 * @returns {object}
 */
function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT secret not configured');
  // Let jsonwebtoken throw detailed errors (e.g., TokenExpiredError)
  return jwt.verify(token, secret);
}

function generateRefreshToken(payload, options = {}) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT secret not configured');
  const jwtOptions = { expiresIn: '7d', ...options };
  return jwt.sign(payload, secret, jwtOptions);
}

function verifyRefreshToken(token) {
  return verifyToken(token);
}

// Optional Express handler for refresh flow
async function refreshTokenHandler(req, res) {
  try {
    // Pull refresh token from secure cookie
    const tokenFromCookie = req.cookies?.refreshToken;
    if (!tokenFromCookie) {
      return res.status(401).json({ message: 'No refresh token' });
    }
    const decoded = verifyRefreshToken(tokenFromCookie);
    const newToken = generateToken({ id: decoded.id, username: decoded.username });
    const newRefresh = generateRefreshToken({ id: decoded.id, username: decoded.username });

    // Rotate cookie
    const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
    res.cookie('refreshToken', newRefresh, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      domain: cookieDomain,
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ token: newToken });
  } catch (err) {
    const message = err?.name === 'TokenExpiredError' ? 'Refresh token expired. Please log in again.' : 'Invalid refresh token';
    return res.status(401).json({ message });
  }
}

module.exports = { generateToken, verifyToken, generateRefreshToken, verifyRefreshToken, refreshTokenHandler };


