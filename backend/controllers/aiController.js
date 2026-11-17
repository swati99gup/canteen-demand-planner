// controllers/aiController.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

function getAvailableKeys() {
    const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
    return rawKeys
        .split(',')
        .map(k => k.trim())
        .filter(k => k && k !== 'your_gemini_api_key_here' && !k.startsWith('AIzaSy_YOUR_'));
}

async function getAiBriefing(req, res, next) {
    const { day, mess_dish, rating, prep, recommended_closing_time } = req.body;
    const keys = getAvailableKeys();

    const fallbackResponse = `📋 [Operational Briefing for Manoj Bhaiya]:\n• Tonight is ${day} (${mess_dish}). Student satisfaction is ${rating}/5.0.\n• Boil ${prep.rice_kg}kg rice & prep ${prep.noodle_packs} noodle packs before 8:00 PM.\n• Target closing time is ${recommended_closing_time}.`;

    if (keys.length === 0) {
        return res.json({ briefing: fallbackResponse });
    }

    const prompt = `You are an operations advisor assisting Manoj Bhaiya, the night utility canteen vendor at NIT Jamshedpur (Hostels C & D).
Today is ${day}. The mess serves "${mess_dish}" with a student rating of ${rating}/5.0.
Calculated Kitchen Preparation:
- Boiled Rice for Fried Rice: ${prep.rice_kg} kg
- Chowmein Noodle Packs: ${prep.noodle_packs} packets
- Eggs Needed: ${prep.total_eggs_needed} eggs (${prep.egg_trays} trays)
Recommended Canteen Closing Time: ${recommended_closing_time}

Write a direct, 3-bullet-point operational shift summary in conversational English/Hinglish for Manoj Bhaiya. Give him immediate actionable advice on preparation, crowd timing, and closing time.`;

    for (let i = 0; i < keys.length; i++) {
        const apiKey = keys[i];
        try {
            console.log(`[Gemini Request] Attempting with Key #${i + 1}...`);
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-4-hydrogen" });
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            console.log(`[Gemini Request] Succeeded with Key #${i + 1}!`);
            return res.json({ briefing: responseText, key_used: `Key #${i + 1}` });
        } catch (error) {
            console.warn(`[Gemini Key #${i + 1} Failed]: ${error.message}. Trying next available key...`);
        }
    }

    console.warn("[All Gemini Keys Exhausted] Falling back to rule-based briefing.");
    res.json({ briefing: fallbackResponse });
}

module.exports = { getAiBriefing, getAvailableKeys };
