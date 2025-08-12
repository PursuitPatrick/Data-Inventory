const express = require('express');
const { loginUser, createUser } = require('../controllers/authController');
const { refreshTokenHandler } = require('../utils/jwtUtils');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', createUser);
router.post('/refresh', refreshTokenHandler);

module.exports = router;


