# NIT Jamshedpur Hostel Night Canteen Spillover Advisor

An operational decision system built for **Manoj Kumar**, operator of the night utility canteen at Hostels C & D, National Institute of Technology Jamshedpur (NITJSR).

The system translates the hostel mess dinner schedule into concrete kitchen preparation batch sizes (boiled rice, noodles, egg crates), recommends optimal closing times, and predicts evening revenue.

---

## 🎥 3-Minute Video Demo
▶️ **[Click here to watch the 3-minute video walkthrough](https://drive.google.com/file/d/1RHENIusaGqM3i9Zp4RuAmsV6VQCOm1-T/view?usp=sharing)** *(Loom / Google Drive / YouTube)*

---

## 1. System Architecture
* **Frontend:** React.js, Tailwind CSS, Recharts, Lucide Icons
* **Backend:** Node.js, Express REST API (Modular MVC Architecture)
  * `config/`: Database pool (`db.js`) & business rules/thresholds (`constants.js`)
  * `controllers/`: Analytics (`analyticsController.js`), Prediction (`predictionController.js`), AI Briefing (`aiController.js`)
  * `routes/`: Express endpoint routing (`canteenRoutes.js`)
  * `middleware/`: Input sanitization (`validateDay.js`) & centralized error catching (`errorHandler.js`)
* **Database:** Real MySQL (Schema with indexes on `day_of_week` and `sale_date`)
* **AI Layer:** Google Gemini API (`@google/generative-ai` with multi-key failover and deterministic fallback)
* **Data Layer:** `data.csv` (21 verified historical shifts based on official NIT Jamshedpur PDD circular rates)

---

## 2. Quick Setup & Run Instructions

### Prerequisites
* MySQL Server (Local or Cloud instance like Aiven/TiDB)
* Node.js & npm

### Step A: Configure & Seed MySQL
1. Open MySQL Workbench or MySQL terminal and create the database:
   ```sql
   CREATE DATABASE nitjsr_canteen;
   ```
2. Navigate to `backend/` and configure `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=nitjsr_canteen
   GEMINI_API_KEY=your_gemini_api_key_optional
   ```
3. Install backend dependencies and seed the database directly from `data.csv`:
   ```bash
   cd backend
   npm install
   node seed.js
   ```
   *(You will see: `[Success] Seeded 21 records from data.csv into MySQL.`)*

4. Start the backend server:
   ```bash
   node server.js
   ```

### Step B: Start the React Dashboard
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 3. Real Output Sample

When **Saturday** is selected (Mess Menu: *Khichdi & Aloo Chokha*, Student Satisfaction Rating: **1.4 / 5.0**):

* **Status:** `🚨 SURGE DEMAND FORECAST` (2.1x Multiplier)
* **Boiled Rice Prep Target:** `12.6 kg` (For Veg & Egg Fried Rice)
* **Chowmein Noodle Packets:** `32 packets` pre-boiled before 8:00 PM
* **Egg Inventory Target:** `4.2 crates` (~126 eggs)
* **Closing Time Recommendation:** `1:45 AM` (*Do not shut early; capture post-study peak rush*)
* **Historical Benchmark:** Average revenue on Saturday is `₹9,607` vs. Wednesday's `₹1,517`.

---

## 4. What the Tool Gets Wrong (Edge Cases & Failure Modes)

1. **Weather Extremes (Heavy Rain):**
   * On sudden rainy evenings (observed on September 11 in row 11), even if the mess dinner is disliked, students avoid walking through waterlogged campus pathways to reach the canteen until rain stops around 10:15 PM, skewing hourly preparation pacing.
2. **Post-Exam / Mid-Semester Waves:**
   * During the final night of mid-semester exams, students stay up regardless of the mess menu, increasing demand for caffeinated drinks and plain Maggi rather than full heavy meals (Fried Rice).
3. **Linear Preparation Assumption:**
   * The model assumes prep scales linearly ($2.1\times$). In reality, boiling $>10$ kg of rice in a small commercial burner causes pan scorching at the bottom, meaning Manoj Bhaiya must split the rice prep into two separate sequential batches (one at 7:30 PM, one at 10:30 PM).
