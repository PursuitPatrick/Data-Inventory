const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const { generateToken, generateRefreshToken } = require('../utils/jwtUtils');

async function createUser(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Ensure username is unique
    const exists = await pool.query('SELECT 1 FROM users WHERE username = $1', [username]);
    if (exists.rowCount > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = generateToken({ id: user.id, username: user.username });
    const refreshToken = generateRefreshToken({ id: user.id, username: user.username });

    // Set refresh token as secure httpOnly cookie for cookie-based refresh flow
    const cookieDomain = process.env.COOKIE_DOMAIN || undefined; // e.g., 'api.magmdomain.com'
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      domain: cookieDomain,
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return access token and (optionally) refresh token for fallback clients
    // Frontend should prefer cookie-based refresh; body refresh is a fallback for browsers blocking third-party cookies.
    res.status(200).json({ token, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createUser, loginUser };


