const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

/**
 * Universal Security Configurations Configuration Wrapper
 */
const configureSecurity = (app) => {
    // Inject Helmet middleware for establishing fundamental HTTP security headers
    app.use(helmet());

    // Resolve structural CORS setups matching environment configuration
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',') 
        : ['http://localhost:5173'];

    app.use(cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error('Not allowed by CORS security policies.'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Enabled PATCH for status updates
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
};

/**
 * High-Security Rate Limiter applied strictly to Authentication Gateways
 */
const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 Minutes tracking window
    max: 5, // Tight lockout rule threshold matching your configuration specifications
    standardHeaders: true, // Draft-6 standard conformance: returns RateLimit-* headers
    legacyHeaders: false, // Disable the X-RateLimit-* header formats completely
    message: { 
        success: false,
        message: 'Too many action execution attempts. Access suspended for 5 minutes.' 
    }
});

module.exports = { configureSecurity, authLimiter };