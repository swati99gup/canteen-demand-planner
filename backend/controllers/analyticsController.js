// controllers/analyticsController.js
const pool = require('../config/db');

async function getAnalytics(req, res, next) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                entry_id,
                DATE_FORMAT(sale_date, '%Y-%m-%d') as sale_date,
                day_of_week,
                mess_dinner_dish,
                student_rating,
                veg_fried_rice_qty,
                egg_fried_rice_qty,
                (veg_fried_rice_qty + egg_fried_rice_qty) as total_rice_sold,
                veg_chowmein_qty,
                egg_chowmein_qty,
                (veg_chowmein_qty + egg_chowmein_qty) as total_chowmein_sold,
                omelette_qty,
                veg_maggi_qty,
                total_revenue_rs,
                stockout_flag,
                early_shutdown_flag,
                field_context_note
            FROM daily_sales
            ORDER BY sale_date ASC
        `);
        res.json(rows);
    } catch (err) {
        next(err);
    }
}

module.exports = { getAnalytics };
