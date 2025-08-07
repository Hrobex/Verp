// نستمر في استخدام "import type" لأنها خاصة بـ TypeScript وتُزال عند التحويل إلى JavaScript
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- الثوابت الأساسية ---
const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// --- نستخدم نفس الإصدار المبسط الذي يركز على نموذج واحد وموثوق ---
const TARGET_MODEL = "llama3-8b-8192";

// --- تعريف الدالة الرئيسية ---
async function handler(req: VercelRequest, res: VercelResponse) {
    console.log("--- Llama-4 API Handler (CommonJS) Started ---");

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        console.log("Request method not allowed:", req.method);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.log("Validation failed: 'messages' array is missing or empty.");
            return res.status(400).json({ error: 'The "messages" array is required.' });
        }

        console.log(`Attempting to call Groq with model: ${TARGET_MODEL}`);
        
        const requestBody = {
            model: TARGET_MODEL,
            messages: messages,
            stream: true,
        };

        const apiResponse = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify(requestBody),
        });
        
        console.log("Groq fetch call completed. Response status:", apiResponse.status);

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.json();
            console.error("Groq API Error:", errorBody);
            return res.status(apiResponse.status).json({
                error: `Groq API returned an error: ${errorBody.error?.message || 'Unknown error'}`
            });
        }
        
        if (!apiResponse.body) {
            throw new Error("Response body from Groq is null");
        }

        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        
        console.log("Headers set for streaming. Starting to pipe stream to client.");

        for await (const chunk of apiResponse.body) {
            res.write(chunk);
        }
        
        res.end();
        console.log("--- Stream finished successfully ---");

    } catch (error: any) {
        console.error("--- A critical error occurred in the handler ---", error);
        
        if (!res.headersSent) {
            res.status(500).json({ error: 'An internal server error occurred.' });
        } else {
            res.end();
        }
    }
}

// --- التغيير الأهم: تصدير الدالة باستخدام صيغة CommonJS ---
module.exports = handler;
