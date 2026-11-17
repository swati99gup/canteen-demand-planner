// server.js - Application Entry Point (Modular MVC Architecture)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const canteenRoutes = require('./routes/canteenRoutes');
const errorHandler = require('./middleware/errorHandler');
const { getAvailableKeys } = require('./controllers/aiController');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'NIT Jamshedpur Canteen Spillover Advisor API',
        gemini_keys_configured: getAvailableKeys().length,
        timestamp: new Date().toISOString()
    });
});

// Mount Modular Routes
app.use('/api', canteenRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`NIT Jamshedpur Canteen Server (Modular MVC)`);
    console.log(`Port: ${PORT} | URL: http://localhost:${PORT}`);
    console.log(`Configured Gemini Keys: ${getAvailableKeys().length}`);
    console.log(`=================================================`);
});
