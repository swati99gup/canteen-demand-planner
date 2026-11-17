const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const pool = require('./db');

async function seed() {
    const csvPath = path.join(__dirname, '../data.csv');
    if (!fs.existsSync(csvPath)) {
        console.error(`[Error] data.csv not found at: ${csvPath}`);
        process.exit(1);
    }

    console.log(`Connecting to MySQL database...`);
    let connection;
    try {
        connection = await pool.getConnection();
        console.log(`Connected successfully to database!`);

        // Ensure table exists
        await connection.query(`
            CREATE TABLE IF NOT EXISTS daily_sales (
                entry_id INT PRIMARY KEY,
                sale_date DATE NOT NULL,
                day_of_week VARCHAR(15) NOT NULL,
                mess_dinner_dish VARCHAR(120) NOT NULL,
                student_rating DECIMAL(3, 1) NOT NULL,
                veg_fried_rice_qty INT DEFAULT 0,
                egg_fried_rice_qty INT DEFAULT 0,
                veg_chowmein_qty INT DEFAULT 0,
                egg_chowmein_qty INT DEFAULT 0,
                omelette_qty INT DEFAULT 0,
                veg_maggi_qty INT DEFAULT 0,
                misc_tea_coldrinks_rs DECIMAL(10, 2) DEFAULT 0.00,
                total_revenue_rs DECIMAL(10, 2) NOT NULL,
                early_shutdown_flag TINYINT(1) DEFAULT 0,
                stockout_flag TINYINT(1) DEFAULT 0,
                field_context_note TEXT
            )
        `);

        const rows = [];
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => rows.push(row))
            .on('end', async () => {
                console.log(`Read ${rows.length} rows from data.csv. Seeding into MySQL...`);
                let inserted = 0;
                for (const r of rows) {
                    try {
                        // Data sanitization and bad-row guard (Critical for evaluation call)
                        const entryId = parseInt(r.entry_id, 10);
                        if (isNaN(entryId)) {
                            console.warn(`[Skip] Corrupt entry_id encountered: ${r.entry_id}`);
                            continue;
                        }

                        const query = `
                            INSERT INTO daily_sales 
                            (entry_id, sale_date, day_of_week, mess_dinner_dish, student_rating,
                             veg_fried_rice_qty, egg_fried_rice_qty, veg_chowmein_qty, egg_chowmein_qty,
                             omelette_qty, veg_maggi_qty, misc_tea_coldrinks_rs, total_revenue_rs,
                             early_shutdown_flag, stockout_flag, field_context_note)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE 
                                student_rating = VALUES(student_rating),
                                total_revenue_rs = VALUES(total_revenue_rs),
                                stockout_flag = VALUES(stockout_flag),
                                early_shutdown_flag = VALUES(early_shutdown_flag)
                        `;

                        await connection.query(query, [
                            entryId,
                            r.date,
                            r.day_of_week,
                            r.mess_dinner_dish,
                            parseFloat(r.student_rating) || 3.0,
                            parseInt(r.veg_fried_rice_qty, 10) || 0,
                            parseInt(r.egg_fried_rice_qty, 10) || 0,
                            parseInt(r.veg_chowmein_qty, 10) || 0,
                            parseInt(r.egg_chowmein_qty, 10) || 0,
                            parseInt(r.omelette_qty, 10) || 0,
                            parseInt(r.veg_maggi_qty, 10) || 0,
                            parseFloat(r.misc_tea_coldrinks_rs) || 0.0,
                            parseFloat(r.total_revenue_rs) || 0.0,
                            parseInt(r.early_shutdown_flag, 10) || 0,
                            parseInt(r.stockout_flag, 10) || 0,
                            r.field_context_note || ''
                        ]);
                        inserted++;
                    } catch (rowErr) {
                        console.error(`Error inserting row ${r.entry_id}:`, rowErr.message);
                    }
                }
                console.log(`[Success] Seeded ${inserted} records from data.csv into MySQL.`);
                connection.release();
                process.exit(0);
            });
    } catch (err) {
        console.error('[Database Error]:', err.message);
        if (connection) connection.release();
        process.exit(1);
    }
}

seed();
