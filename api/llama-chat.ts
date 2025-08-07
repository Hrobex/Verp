import type { VercelRequest, VercelResponse } from '@vercel/node';

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const TARGET_MODEL = "llama3-8b-8192";

// العودة إلى export default كما هو الحال في ملفك العامل
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

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.json();
            console.error("Groq API Error:", errorBody);
            return res.status(apiResponse.status).json(errorBody);
        }
        
        if (!apiResponse.body) {
            throw new Error("Response body from Groq is null");
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of apiResponse.body) {
            res.write(chunk);
        }
        
        res.end();

    } catch (error: any) {
        console.error("Critical error in API handler:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.end();
        }
    }
}
