// middleware/validateDay.js
const { WEEKLY_MENU } = require('../config/constants');

function validateDay(req, res, next) {
    const rawDay = req.query.day || 'Saturday';
    const day = rawDay.charAt(0).toUpperCase() + rawDay.slice(1).toLowerCase();

    if (!WEEKLY_MENU[day]) {
        return res.status(400).json({
            error: `Invalid day parameter '${rawDay}'. Must be one of: ${Object.keys(WEEKLY_MENU).join(', ')}`
        });
    }

    req.normalizedDay = day;
    next();
}

module.exports = validateDay;
