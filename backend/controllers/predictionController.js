// controllers/predictionController.js
const pool = require('../config/db');
const {
    BASE_RICE_KG,
    BASE_NOODLE_PACKETS,
    BASE_EGG_TRAYS,
    SURGE_DISLIKE_THRESHOLD,
    EARLY_CLOSE_THRESHOLD,
    WEEKLY_MENU
} = require('../config/constants');

async function getPrediction(req, res, next) {
    const day = req.normalizedDay || 'Saturday';
    const menuInfo = WEEKLY_MENU[day] || WEEKLY_MENU['Saturday'];
    const rating = menuInfo.rating;

    let multiplier = 1.0;
    let status = "NORMAL";
    let closingTime = "12:00 Midnight";
    let alertMsg = "Normal dinner spillover. Maintain standard kitchen prep.";

    if (rating < SURGE_DISLIKE_THRESHOLD) {
        multiplier = 2.1;
        status = "SURGE";
        closingTime = day === "Saturday" ? "1:45 AM" : "1:15 AM";
        alertMsg = "🚨 MAJOR RUSH: Mess dinner heavily disliked! Students skipping mess for Fried Rice & Chowmein.";
    } else if (rating > EARLY_CLOSE_THRESHOLD) {
        multiplier = 0.4;
        status = "LOW";
        closingTime = "11:15 PM";
        alertMsg = "💤 LOW FOOTFALL: High mess attendance (Special dinner). Shut early to save electricity and gas.";
    }

    try {
        const [stats] = await pool.query(
            `SELECT 
                COUNT(*) as sample_count,
                AVG(total_revenue_rs) as avg_revenue,
                MAX(total_revenue_rs) as peak_revenue,
                SUM(stockout_flag) as stockout_occurrences
             FROM daily_sales 
             WHERE day_of_week = ?`,
            [day]
        );

        const avgRev = stats[0] && stats[0].avg_revenue ? Math.round(stats[0].avg_revenue) : 0;
        const peakRev = stats[0] && stats[0].peak_revenue ? Math.round(stats[0].peak_revenue) : 0;
        const stockouts = stats[0] ? stats[0].stockout_occurrences : 0;

        res.json({
            day,
            mess_dish: menuInfo.dish,
            rating,
            status,
            multiplier,
            recommended_closing_time: closingTime,
            alert_message: alertMsg,
            prep: {
                rice_kg: (BASE_RICE_KG * multiplier).toFixed(1),
                noodle_packs: Math.round(BASE_NOODLE_PACKETS * multiplier),
                egg_trays: (BASE_EGG_TRAYS * multiplier).toFixed(1),
                total_eggs_needed: Math.round(BASE_EGG_TRAYS * multiplier * 30)
            },
            sql_metrics: {
                sample_count: stats[0].sample_count || 0,
                historical_avg_revenue: avgRev,
                historical_peak_revenue: peakRev,
                stockout_rate_pct: stats[0].sample_count ? Math.round((stockouts / stats[0].sample_count) * 100) : 0
            }
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { getPrediction };
