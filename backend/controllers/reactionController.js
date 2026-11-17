// controllers/reactionController.js
const pool = require('../config/db');

// Helper to normalize day name (e.g. "saturday" -> "Saturday")
function formatDay(rawDay) {
    if (!rawDay || typeof rawDay !== 'string') return 'Saturday';
    const trimmed = rawDay.trim();
    if (!trimmed) return 'Saturday';
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

// GET /api/reactions?day=Saturday - Fetch reactions for selected day
async function getReactions(req, res, next) {
    const day = formatDay(req.query?.day || req.body?.day_of_week || req.query?.day_of_week);

    try {
        const [counts] = await pool.query(`
            SELECT dish_name, vote_count 
            FROM order_reactions 
            WHERE day_of_week = ? AND vote_count > 0
            ORDER BY vote_count DESC
        `, [day]);

        const [totalRow] = await pool.query(`
            SELECT COALESCE(SUM(vote_count), 0) as total 
            FROM order_reactions 
            WHERE day_of_week = ?
        `, [day]);

        res.json({
            day,
            total_reactions: totalRow[0]?.total || 0,
            breakdown: counts || []
        });
    } catch (err) {
        next(err);
    }
}

// POST /api/reactions - Add (+1) to reaction count for a dish on that day
async function addReaction(req, res, next) {
    const dish_name = req.body?.dish_name || req.query?.dish_name;
    const day = formatDay(req.body?.day_of_week || req.query?.day || req.query?.day_of_week);

    if (!dish_name) {
        return res.status(400).json({ error: "dish_name is required" });
    }

    try {
        await pool.query(`
            INSERT INTO order_reactions (day_of_week, dish_name, vote_count)
            VALUES (?, ?, 1)
            ON DUPLICATE KEY UPDATE vote_count = vote_count + 1
        `, [day, dish_name]);

        // Return updated day list
        return getReactions(req, res, next);
    } catch (err) {
        next(err);
    }
}

// POST /api/reactions/remove - Decrement (-1) reaction count for a dish on that day
async function removeReaction(req, res, next) {
    const dish_name = req.body?.dish_name || req.query?.dish_name;
    const day = formatDay(req.body?.day_of_week || req.query?.day || req.query?.day_of_week);

    if (!dish_name) {
        return res.status(400).json({ error: "dish_name is required" });
    }

    try {
        await pool.query(`
            UPDATE order_reactions 
            SET vote_count = GREATEST(0, vote_count - 1)
            WHERE day_of_week = ? AND dish_name = ?
        `, [day, dish_name]);

        // Clean up 0 count entries
        await pool.query(`
            DELETE FROM order_reactions 
            WHERE day_of_week = ? AND vote_count <= 0
        `, [day]);

        return getReactions(req, res, next);
    } catch (err) {
        next(err);
    }
}

// POST /api/reactions/reset - Reset all reactions for that day
async function resetReactions(req, res, next) {
    const day = formatDay(req.body?.day_of_week || req.query?.day || req.query?.day_of_week);

    try {
        await pool.query(`DELETE FROM order_reactions WHERE day_of_week = ?`, [day]);
        return getReactions(req, res, next);
    } catch (err) {
        next(err);
    }
}

module.exports = { 
    getReactions, 
    addReaction, 
    removeReaction, 
    resetReactions 
};
