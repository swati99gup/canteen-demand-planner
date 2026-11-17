const pool = require('./config/db');

async function updateSchema() {
    console.log("Updating order_reactions table to support Day-wise CRUD...");
    
    // Drop old table to apply clean day-wise unique constraint
    await pool.query("DROP TABLE IF EXISTS order_reactions");

    await pool.query(`
        CREATE TABLE order_reactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            day_of_week VARCHAR(15) NOT NULL,
            dish_name VARCHAR(60) NOT NULL,
            vote_count INT NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_day_dish (day_of_week, dish_name),
            INDEX idx_day (day_of_week)
        )
    `);

    // Seed realistic day-wise reactions matching mess quality
    const daySeedData = [
        // Saturday (Khichdi night - super surge)
        ['Saturday', 'Egg Fried Rice', 12],
        ['Saturday', 'Veg Chowmein', 7],
        ['Saturday', 'Double Egg Omelette', 5],
        ['Saturday', 'Veg Maggi', 3],

        // Tuesday (Lauki night - high rush)
        ['Tuesday', 'Egg Fried Rice', 9],
        ['Tuesday', 'Veg Chowmein', 6],
        ['Tuesday', 'Double Egg Omelette', 4],

        // Wednesday (Chicken/Paneer night - very low)
        ['Wednesday', 'Veg Maggi', 2],
        ['Wednesday', 'Double Egg Omelette', 1],

        // Monday (Soyabean night - moderate/high)
        ['Monday', 'Egg Fried Rice', 7],
        ['Monday', 'Veg Chowmein', 5],

        // Friday (Baigan night - high)
        ['Friday', 'Egg Fried Rice', 8],
        ['Friday', 'Veg Chowmein', 6]
    ];

    for (const [day, dish, count] of daySeedData) {
        await pool.query(
            `INSERT INTO order_reactions (day_of_week, dish_name, vote_count) 
             VALUES (?, ?, ?)`,
            [day, dish, count]
        );
    }

    console.log("[Success] Day-wise order_reactions schema created and populated!");
    process.exit(0);
}

updateSchema().catch(err => {
    console.error("Migration error:", err);
    process.exit(1);
});
