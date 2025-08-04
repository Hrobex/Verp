import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// --- الأسرار التشغيلية ---
// 1. مفتاح API موضوع مباشرة في الكود بناءً على طلبك
const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc";

// 2. قائمة النماذج الأصلية الخاصة بك
const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash"
];

// 3. الـ Prompt الخفي الأصلي الخاص بك
const masterPrompt = `Your mission is to act as an expert prompt engineer for AI image generators like Midjourney or Stable Diffusion. Analyze the uploaded image with extreme detail. Generate a single, coherent, and rich descriptive prompt that can replicate the image. 
**CRITICAL CONSTRAINT: The final output prompt must NOT exceed 70 words. This is a strict limit. Be concise, impactful, and stay strictly within the word limit.**
Focus on subject, environment, art style, composition, lighting, and color palette. End with powerful keywords like "highly detailed, 4k, cinematic". Output ONLY the final, ready-to-use prompt.`;


export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // تم تكييف هذا الجزء ليعمل مع الواجهة الأمامية الأصلية
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: 'Missing image data or MIME type' });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const imagePart = {
      inlineData: { data: imageBase64, mimeType },
    };

    for (const modelName of MODEL_FALLBACK_CHAIN) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const safetySettings = [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];
        const result = await model.generateContent({ contents: [{ role: "user", parts: [imagePart, { text: masterPrompt }] }], safetySettings });
        const promptText = result.response.text();

        if (promptText) {
          return res.status(200).json({ prompt: promptText });
        }
        
        // إذا كان الرد فارغًا، نعتبره خطأ وننتقل للنموذج التالي
        throw new Error(`Model ${modelName} returned an empty response.`);

      } catch (err) {
        // نستمر في المحاولة مع النموذج التالي إذا فشل الحالي
        console.error(`Error with model ${modelName}:`, String(err));
        continue;
      }
    }

    // إذا فشلت كل النماذج في الحلقة، نرجع رسالة خطأ واضحة
    return res.status(503).json({ error: "All AI models are currently busy or unavailable. Please try again later." });

  } catch (e) {
    console.error("A global error occurred in the handler:", e);
    return res.status(500).json({ error: "An internal server error occurred." });
  }
}
