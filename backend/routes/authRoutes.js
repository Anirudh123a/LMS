const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/security');

// FIXED: Adjusted import keys to pull verifyToken instead of non-existent authenticateToken
const { verifyToken } = require('../middleware/auth');

// ── Public Authentication Deck Endpoints ─────────────────────────
router.post('/register', authController.registerStudent);
router.post('/verify-otp', authLimiter, authController.verifyOtp);
router.get('/colleges', authController.listActiveColleges);
router.post('/login', authController.login);

// ── Password Recovery Account Security Pipeline ──────────────────
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', authLimiter, authController.resetPassword);

// ── Protected Session Integrations Layer ─────────────────────────
// FIXED: Swapped authenticateToken out for verifyToken
router.get('/me', verifyToken, authController.getCurrentUser);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;