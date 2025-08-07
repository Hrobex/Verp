import type { VercelRequest, VercelResponse } from '@vercel/node';

// الثوابت تبقى كما هي
const GROQ_API_KEY = "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";
const MODEL_FALLBACK_CHAIN = [
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "llama-3.3-70b-versatile",
  "llama3-70b-8192"
];
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'The "messages" array is required.' });
        }

        let stream: ReadableStream | null = null;

        // حلقة التبديل التلقائي لا تزال موجودة
        for (const modelName of MODEL_FALLBACK_CHAIN) {
            console.log(`Attempting to stream with model: ${modelName}`);
            try {
                const requestBody = {
                    model: modelName,
                    messages: messages,
                    // --- التغيير الأهم ---
                    // نطلب من الـ API أن يرسل الرد كبث مباشر
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

                // إذا فشل الطلب، انتقل إلى النموذج التالي في السلسلة
                if (!apiResponse.ok) {
                    const errorBody = await apiResponse.text();
                    console.error(`Error with model ${modelName}: ${apiResponse.statusText}`, errorBody);
                    continue; // انتقل للمحاولة التالية
                }
                
                // إذا نجحنا، احصل على الـ stream واخرج من الحلقة
                stream = apiResponse.body;
                console.log(`Successfully connected to stream with: ${modelName}`);
                break;

            } catch (error) {
                console.error(`Caught error while trying model ${modelName}:`, error);
                // استمر في المحاولة مع النموذج التالي
            }
        }

        if (stream) {
            // --- تمرير البث المباشر للمستخدم ---
            // نغير نوع المحتوى لنخبر المتصفح أنه بث من الأحداث
            res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, no-transform');
            res.setHeader('Connection', 'keep-alive');
            
            // نستخدم pipe لتمرير البث من Groq إلى المستخدم مباشرةً
            const reader = stream.getReader();
            const pump = async () => {
              const { done, value } = await reader.read();
              if (done) {
                res.end();
                return;
              }
              res.write(value);
              await pump();
            };
            
            await pump();

        } else {
            // إذا فشلت كل النماذج
            return res.status(502).json({
                error: "The AI service is currently unavailable after trying multiple models. Please try again later."
            });
        }

    } catch (error) {
        console.error("A critical server error occurred:", error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
