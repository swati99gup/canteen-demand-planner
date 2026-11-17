const pool = require('./config/db');

async function init() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS order_reactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            dish_name VARCHAR(60) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Clean previous test data
    await pool.query("TRUNCATE TABLE order_reactions");

    // Add initial student reaction tallies
    const initialVotes = [
        'Egg Fried Rice', 'Egg Fried Rice', 'Veg Chowmein', 
        'Egg Fried Rice', 'Veg Maggi', 'Egg Chowmein', 
        'Egg Fried Rice', 'Double Egg Omelette', 'Veg Chowmein'
    ];

    for (const item of initialVotes) {
        await pool.query('INSERT INTO order_reactions (dish_name) VALUES (?)', [item]);
    }

    console.log("order_reactions table ready and seeded!");
    process.exit(0);
}

init().catch(e => {
    console.error(e);
    process.exit(1);
});
