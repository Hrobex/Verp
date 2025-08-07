import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- الثوابت الأساسية ---
const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// --- تبسيط: سنستخدم نموذجًا واحدًا وموثوقًا للتشخيص ---
const TARGET_MODEL = "llama3-8b-8192"; // اخترنا نموذجًا صغيرًا وسريعًا ومستقرًا للاختبار

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log("--- Llama-4 API Handler Started ---");

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
        console.log(`Number of messages received: ${messages.length}`);

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

        // --- فحص دقيق للرد من Groq ---
        if (!apiResponse.ok) {
            // إذا فشل الطلب، سجل الخطأ من Groq وأرسل ردًا واضحًا
            const errorBody = await apiResponse.json();
            console.error("Groq API Error:", errorBody);
            return res.status(apiResponse.status).json({
                error: `Groq API returned an error: ${errorBody.error?.message || 'Unknown error'}`
            });
        }
        
        // --- نجاح: إعداد البث إلى المستخدم ---
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        
        console.log("Headers set for streaming. Starting to pipe stream to client.");

        // --- استخدام النمط الحديث والموثوق للبث ---
        if (!apiResponse.body) {
            throw new Error("Response body is null");
        }

        for await (const chunk of apiResponse.body) {
            res.write(chunk);
        }
        
        res.end();
        console.log("--- Stream finished successfully ---");

    } catch (error: any) {
        // --- التعامل مع أي أخطاء غير متوقعة ---
        console.error("--- A critical error occurred in the handler ---");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        // تأكد من أننا لا نرسل ردًا إذا كان البث قد بدأ بالفعل
        if (!res.headersSent) {
            res.status(500).json({ error: 'An internal server error occurred.' });
        } else {
            res.end(); // إذا بدأ البث، فقط أنهِ الاتصال
        }
    }
}
