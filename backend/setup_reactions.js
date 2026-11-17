const pool = require('./config/db');

async function setup() {
    console.log("Setting up student_reactions table...");
    await pool.query(`
        CREATE TABLE IF NOT EXISTS student_reactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hostel_block VARCHAR(20) NOT NULL,
            intended_dish VARCHAR(60) NOT NULL,
            pickup_time_slot VARCHAR(40) NOT NULL,
            commitment_level VARCHAR(20) DEFAULT 'HIGH',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Clean previous test rows to avoid duplicates
    await pool.query("TRUNCATE TABLE student_reactions");

    // Seed realistic student intent responses for Hostels A, B, C, D
    const samples = [
        ['Hostel D', 'Egg Fried Rice', '10:30 PM - 11:30 PM', 'HIGH'],
        ['Hostel C', 'Egg Fried Rice', '11:30 PM - 12:30 AM', 'HIGH'],
        ['Hostel D', 'Veg Chowmein', '10:00 PM - 11:00 PM', 'MEDIUM'],
        ['Hostel A', 'Egg Chowmein', 'Post 12:00 AM (Late Night)', 'HIGH'],
        ['Hostel C', 'Egg Fried Rice', 'Post 12:00 AM (Late Night)', 'HIGH'],
        ['Hostel B', 'Single Egg Maggi', '11:00 PM - 12:00 AM', 'HIGH'],
        ['Hostel D', 'Egg Fried Rice', 'Post 12:00 AM (Late Night)', 'HIGH'],
        ['Hostel C', 'Veg Fried Rice', '10:30 PM - 11:30 PM', 'MEDIUM'],
        ['Hostel D', 'Double Egg Omelette', 'Post 12:00 AM (Late Night)', 'HIGH'],
        ['Hostel A', 'Egg Fried Rice', '11:00 PM - 12:00 AM', 'HIGH']
    ];

    for (const s of samples) {
        await pool.query(
            'INSERT INTO student_reactions (hostel_block, intended_dish, pickup_time_slot, commitment_level) VALUES (?, ?, ?, ?)',
            s
        );
    }

    console.log("student_reactions table created and seeded with 10 real student intents!");
    process.exit(0);
}

setup().catch(err => {
    console.error("Setup error:", err);
    process.exit(1);
});
