// config/constants.js
// Configurable thresholds & mess menu for easy live modification in the call

const BASE_RICE_KG = 6.0;             // Base kg raw rice for normal turnover
const BASE_NOODLE_PACKETS = 15;       // Base packets of Chowmein noodles
const BASE_EGG_TRAYS = 2.0;           // 1 tray = 30 eggs
const SURGE_DISLIKE_THRESHOLD = 2.5;  // Rating below this triggers emergency buffer
const EARLY_CLOSE_THRESHOLD = 4.0;    // Rating above this triggers cost-saving early close

// NIT Jamshedpur Hostel Mess Menu Schedule (Hostels A, B, C, D, RLB, AHR)
const WEEKLY_MENU = {
    "Monday": { dish: "Soyabean Semi Dry & Chana Dal", rating: 2.2 },
    "Tuesday": { dish: "Lauki Chana & Masoor Dal", rating: 2.0 },
    "Wednesday": { dish: "Matar Paneer / Chicken Curry", rating: 4.8 },
    "Thursday": { dish: "Peas Pulao & Chana Dal", rating: 3.0 },
    "Friday": { dish: "Aloo Baigan Sabzi & Moong Dal", rating: 2.4 },
    "Saturday": { dish: "Khichdi & Aloo Chokha", rating: 1.4 },
    "Sunday": { dish: "Puri & Kabuli Chana", rating: 4.2 }
};

module.exports = {
    BASE_RICE_KG,
    BASE_NOODLE_PACKETS,
    BASE_EGG_TRAYS,
    SURGE_DISLIKE_THRESHOLD,
    EARLY_CLOSE_THRESHOLD,
    WEEKLY_MENU
};
