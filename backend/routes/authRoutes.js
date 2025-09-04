const express = require('express');
const { loginUser, createUser } = require('../controllers/authController');
const { refreshTokenHandler } = require('../utils/jwtUtils');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', createUser);
router.post('/refresh', refreshTokenHandler);

// Logout: clear refresh cookie
router.post('/logout', (req, res) => {
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    domain: cookieDomain,
    path: '/auth',
  });
  res.status(204).end();
});

module.exports = router;


