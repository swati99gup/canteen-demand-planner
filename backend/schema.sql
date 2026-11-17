-- schema.sql: Real MySQL Table Definition for NIT Jamshedpur Canteen Spillover System
CREATE DATABASE IF NOT EXISTS nitjsr_canteen;
USE nitjsr_canteen;

DROP TABLE IF EXISTS daily_sales;

CREATE TABLE daily_sales (
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
    field_context_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_day (day_of_week),
    INDEX idx_date (sale_date)
);
