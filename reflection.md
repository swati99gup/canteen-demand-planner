# Project Reflection

### What I Got Wrong at the Start
When I started this assignment, I made the classic computer science student mistake: I assumed the problem was purely algorithmic and could be solved with a complex mobile app where hostelers pre-book their canteen meals via QR code. 
Within five minutes of standing at Manoj Bhaiya's counter during fieldwork, that assumption completely fell apart. Manoj Bhaiya handles flaming woks and boiling pots with both hands in a tight space; he has no time to check app notifications. Moreover, hungry students rushing out of a bad mess dinner want food immediately without downloading another campus utility app. The real leverage point was not customer ordering, but **raw material preparation and shift timing** driven by the mess schedule.

### What I Would Cut
If I had to build a leaner version within 2 hours, I would completely eliminate the Gemini AI briefing endpoint. While the LLM generates pleasant Hinglish summaries for the shopkeeper, the core mathematical rules and SQL aggregations do 100% of the actual operational work. The AI briefing adds external dependency risk without altering the physical recommendation of how many egg trays or kilograms of rice to boil.

### Where AI Helped and Where It Wasted Time
* **Where AI Helped:** AI was remarkably fast at generating clean Recharts chart wrappers, structuring the SQL table constraints, and drafting the boilerplate Express routing logic. It allowed me to move from concept to a working full-stack implementation without getting stuck on CSS layout quirks.
* **Where AI Wasted Time:** AI initially tried to push complex machine-learning libraries (like Scikit-learn random forests and ARIMA time series) onto a 21-row dataset. Feeding a 21-row dataset into deep learning models produces meaningless overfitting. I had to discard the AI's predictive model suggestions and replace them with transparent, auditable heuristic multipliers that Manoj Bhaiya can understand and verify in five seconds.
