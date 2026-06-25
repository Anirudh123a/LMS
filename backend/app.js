require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { configureSecurity } = require('./middleware/security');

// Initialize Core Application Pipeline Instantly
const app = express();

// ── 1. Global Parsing Middlewares ─────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── 2. Security Layer Initialization ──────────────────────────────
// This handles CORS (using process.env settings), Helmet headers, and allows safe routing execution
configureSecurity(app);

// ── 3. Route Imports ──────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const mentorRoutes = require('./routes/mentorRoutes'); 

// ── 4. Service Endpoints Pipeline ─────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superAdminRoutes); 
app.use('/api/vendor', vendorRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/mentors', mentorRoutes); 

// ── 5. System Health Diagnostic Route ─────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', time: new Date() });
});

// ── 6. Fallback 404 Route Handler ─────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: `Route ${req.method} ${req.path} not found on this server.` 
    });
});

// ── 7. Unhandled Critical Error Interceptor ───────────────────────
app.use((err, req, res, next) => {
    console.error("=== UNHANDLED CRITICAL ROUTE CRASH ===");
    console.error(err.stack);
    console.error("======================================");
    
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong on the server.', 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;