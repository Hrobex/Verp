import type { VercelRequest, VercelResponse } from '@vercel/node';

// 1. الثوابت الأساسية
// تم وضع مفتاح الـ API مباشرة في الكود بناءً على طلبك.
const GROQ_API_KEY = "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";

// مصفوفة النماذج بالترتيب الذي سيتم تجربته.
const MODEL_FALLBACK_CHAIN = [
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "llama-3.3-70b-versatile",
  "llama3-70b-8192"
];

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// 2. دالة المعالجة الرئيسية
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // التأكد من أن الطلب من نوع POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 3. استقبال سجل المحادثة من الواجهة الأمامية
        // نتوقع أن ترسل الواجهة الأمامية مصفوفة من الرسائل.
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'The "messages" array is required and cannot be empty.' });
        }

        let finalResultText: string | null = null;
        let successfulModel: string | null = null;

        // 4. حلقة التبديل التلقائي بين النماذج
        for (const modelName of MODEL_FALLBACK_CHAIN) {
            console.log(`Attempting to use model: ${modelName}`); // للتتبع في سجلات Vercel
            try {
                const requestBody = {
                    model: modelName,
                    messages: messages, // تمرير سجل المحادثة كما هو
                    temperature: 0.7,   // قيمة للتحكم في إبداعية الرد
                    max_tokens: 1024,   // الحد الأقصى لطول الرد
                };

                const apiResponse = await fetch(GROQ_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${GROQ_API_KEY}`
                    },
                    body: JSON.stringify(requestBody),
                });
                
                const responseData = await apiResponse.json();

                if (!apiResponse.ok) {
                    // إذا فشل الـ API لسبب معين (مثل عدم توفر النموذج)، سجل الخطأ وانتقل للتالي
                    console.error(`Error with model ${modelName}:`, responseData.error?.message || 'Unknown API Error');
                    throw new Error(`API Error from ${modelName}`);
                }

                // استخراج النص من الرد
                const generatedText = responseData.choices?.[0]?.message?.content;

                if (generatedText && generatedText.trim()) {
                    finalResultText = generatedText.trim();
                    successfulModel = modelName;
                    console.log(`Successfully got response from: ${successfulModel}`);
                    break; // نجحنا، اخرج من الحلقة
                } else {
                    // إذا كان الرد فارغًا، اعتبره فشلاً وانتقل للتالي
                    console.warn(`Empty response from ${modelName}`);
                    throw new Error(`Empty response from ${modelName}`);
                }

            } catch (error) {
                // أي خطأ هنا (مشكلة بالشبكة، رد فارغ، ...) سيجعل الحلقة تستمر للنموذج التالي
                console.log(`Continuing to next model after error with ${modelName}.`);
            }
        }

        // 5. إرسال النتيجة النهائية أو رسالة خطأ شاملة
        if (finalResultText) {
            // أرسل الرد الناجح مع اسم النموذج الذي استخدمته (اختياري لكن مفيد للتتبع)
            return res.status(200).json({
                reply: finalResultText,
                modelUsed: successfulModel
            });
        } else {
            // إذا فشلت كل النماذج في السلسلة
            return res.status(502).json({
                error: "The AI service is currently unavailable after trying multiple models. Please try again later."
            });
        }

    } catch (error) {
        // للتعامل مع أخطاء غير متوقعة (مثل خطأ في تحليل JSON للطلب)
        console.error("A critical server error occurred:", error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
