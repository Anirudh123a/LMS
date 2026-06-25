require('dotenv').config();
const app = require('./app');

// Fallback to port 5000 if process.env.PORT fails to read from your .env file
const PORT = process.env.PORT || 5000;

// Initialize Server Engine Configuration Instance
const server = app.listen(PORT, () => {
    console.log(`[LMS RUNNING] Enterprise Application Service Engine initialized safely on runtime port: ${PORT}`);
});

// Error handling for common process level crashes (like Port Already In Use)
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`[FATAL ERROR] Port ${PORT} is already being used by another application. Please stop it or choose another port.`);
        process.exit(1);
    } else {
        console.error('[SERVER RUNTIME ERROR]', error);
    }
});