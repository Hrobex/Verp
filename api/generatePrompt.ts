// Import types for Vercel Serverless Functions
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// سلسلة النماذج الأصلية والسرية لـ Promptigen
const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash"
];

// الـ Prompt الخفي والأساسي الخاص بك
const masterPrompt = `Your mission is to act as an expert prompt engineer for AI image generators like Midjourney or Stable Diffusion. Analyze the uploaded image with extreme detail. Generate a single, coherent, and rich descriptive prompt that can replicate the image. 
**CRITICAL CONSTRAINT: The final output prompt must NOT exceed 70 words. This is a strict limit. Be concise, impactful, and stay strictly within the word limit.**
Focus on subject, environment, art style, composition, lighting, and color palette. End with powerful keywords like "highly detailed, 4k, cinematic". Output ONLY the final, ready-to-use prompt.`;

// الدالة الرئيسية التي ستعمل على الخادم
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // التأكد من أن الطلب هو POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // قراءة مفتاح API بأمان من متغيرات البيئة
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('API Key not found');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const { imageBase64, mimeType } = req.body;
    if (!imageBase64 || !mimeType) {
        return res.status(400).json({ error: 'Missing image data or mimeType' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const imagePart = {
      inlineData: { data: imageBase64, mimeType: mimeType },
    };
    
    // نفس منطق التبديل بين النماذج، ولكنه الآن يعمل بأمان على الخادم
    for (const modelName of MODEL_FALLBACK_CHAIN) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [imagePart, { text: masterPrompt }] }],
            safetySettings: [ /* ... إعدادات الأمان ... */ ]
        });

        const promptText = result.response.text();
        if (promptText) {
          // إرسال النتيجة الناجحة إلى الواجهة الأمامية
          return res.status(200).json({ prompt: promptText });
        }
      } catch (error) {
        console.error(`Error with model ${modelName}:`, error);
        // نستمر في المحاولة مع النموذج التالي إذا فشل الحالي
      }
    }

    // إذا فشلت كل النماذج، نرسل رسالة خطأ
    return res.status(500).json({ error: 'The tool is currently experiencing high demand or an unexpected error. Please try again later.' });

  } catch (error) {
    console.error('General error:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
      }
