import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- استخدام الثوابت من ملفك العامل ---
const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc";
const TARGET_MODEL = "gemini-1.5-flash-latest"; // استخدام نموذج من قائمتك
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${TARGET_MODEL}:generateContent?key=${API_KEY}`;
const SAFETY_SETTINGS = [{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }];

// --- استخدام export default كما هو الحال في ملفك العامل ---
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { messages } = req.body;
        if (!messages) {
            return res.status(400).json({ error: 'Missing "messages" in request body' });
        }

        // --- تحويل صيغة الرسائل من OpenAI إلى صيغة Gemini ---
        const contents = messages.map((msg: { role: string, content: string }) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const requestBody = {
            contents: contents,
            safetySettings: SAFETY_SETTINGS
        };

        const apiResponse = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        // --- تحليل الرد بالطريقة التي تعمل بها أداتك الأخرى ---
        const responseData = await apiResponse.json();
        
        if (!apiResponse.ok) {
            console.error("Gemini API Error:", responseData);
            return res.status(apiResponse.status).json(responseData);
        }

        const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (generatedText && generatedText.trim()) {
            // إرسال الرد في صيغة يتوقعها كود الواجهة الأمامية
            return res.status(200).json({ reply: generatedText.trim() });
        } else {
            return res.status(500).json({ error: "The AI returned an empty response." });
        }

    } catch (error: any) {
        console.error("Critical error in API handler:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
