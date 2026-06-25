const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool that natively supports async/await promises
const pool = mysql.createPool({
    host:               process.env.DB_HOST     || 'localhost',
    user:               process.env.DB_USER     || 'root',
    password:           process.env.DB_PASSWORD || process.env.DB_PASS || '', 
    database:           process.env.DB_NAME     || 'lms_production',
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0 // 0 means infinite queue limit (prevents connection dropouts under load)
});

module.exports = pool;