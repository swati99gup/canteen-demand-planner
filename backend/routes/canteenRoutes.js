// routes/canteenRoutes.js
const express = require('express');
const router = express.Router();

const { getAnalytics } = require('../controllers/analyticsController');
const { getPrediction } = require('../controllers/predictionController');
const { getAiBriefing } = require('../controllers/aiController');
const { 
    getReactions, 
    addReaction, 
    removeReaction, 
    resetReactions 
} = require('../controllers/reactionController');
const validateDay = require('../middleware/validateDay');

// GET /api/analytics - Historical records for Recharts
router.get('/analytics', getAnalytics);

// GET /api/predict?day=... - Demand prediction & kitchen prep calculation
router.get('/predict', validateDay, getPrediction);

// POST /api/ai-briefing - Gemini operational briefing
router.post('/ai-briefing', getAiBriefing);

// Day-Wise Student Order Reactions (CRUD)
router.get('/reactions', getReactions);
router.post('/reactions', addReaction);
router.post('/reactions/remove', removeReaction);
router.post('/reactions/reset', resetReactions);

module.exports = router;
