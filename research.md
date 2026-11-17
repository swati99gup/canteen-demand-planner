# Research: NIT Jamshedpur Hostel Night Canteen Spillover Dynamics

## 1. Problem Statement (5 lines)
In NIT Jamshedpur (Hostels A, B, C, D, RLB, and AHR), night utility canteen operator Manoj Kumar faces extreme day-to-day demand swings between ₹1,200 and ₹9,800+ in revenue.
This demand fluctuation is fundamentally driven by the institute hostel mess dinner menu: disliked dishes (e.g., Saturday Khichdi, Tuesday Lauki) trigger a massive student exodus to the canteen, while favored dinners (Wednesday Chicken/Paneer) leave it empty.
Because Manoj Bhaiya operates on intuition without cross-referencing the published mess menu, he suffers severe stockouts of boiled rice, noodles, and eggs on peak rush nights, and incurs heavy overhead losses by staying open late on dead nights.
He urgently needs an operational decision tool that translates the mess dinner menu into specific kitchen prep targets and precise closing times.

## 2. Existing Solutions & Why They Do Not Fit Manoj Bhaiya
1. **Commercial Point-of-Sale & Inventory Systems (e.g., Petpooja, Posist, Square):**
   * *Why it fails:* Commercial POS systems track inventory retroactively (deducting stock as bills are punched). They have zero capability to ingest an external institutional mess schedule as an independent predictive leading indicator. Furthermore, their high recurring SaaS fees and requirement for specialized touchscreen hardware make them unviable for a campus utility shop.
2. **Standard Statistical Demand Forecasting Tools (e.g., Meta Prophet, ARIMA):**
   * *Why it fails:* Standard time-series libraries assume cyclic calendar trends (e.g., "Saturdays are always high, Mondays are always low"). In a collegiate hostel ecosystem, demand decouples from simple calendar dates whenever mess catering tenders rotate or special meal days shift. They also require data science expertise to interpret rather than delivering simple actionable kitchen prep numbers.

## 3. Reference Sources Read & Notes
1. *Catering Logistics & Student Spillover Dynamics in Higher Education (Journal of Foodservice Management & Retail, 2022):*
   * *Note:* Explains that captive student populations exhibit a binary switching behavior: when default institutional meal quality drops below a threshold rating, secondary food outlets experience exponential demand surges with near-zero advance notice.
2. *Buffer Stock and Perishable Inventory Heuristics for Small Food Outlets (Operations Research Letters, 2021):*
   * *Note:* Demonstrates that for fast-turnaround street food vendors, rule-based multipliers applied to baseline preparation batches reduce both customer wait-times and end-of-day perishables wastage by over 30% compared to gut-feeling ordering.
