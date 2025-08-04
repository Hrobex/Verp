// api/generate-prompt.ts (النسخة النهائية والمضمونة)

// استيراد الأنواع من Vercel ومن مكتبة جوجل (التي قمنا بتثبيتها)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from "@google/generative-ai";

// --- الأسرار والإعدادات المحمية على الخادم ---

// 1. قراءة مفتاح API بأمان من متغيرات البيئة في Vercel
const apiKey = process.env.GEMINI_API_KEY;

// 2. سلسلة النماذج الاحتياطية (أسرار العمل)
const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-pro-vision"
];

// 3. الـ "Prompt الخفي" (الوصفة السرية)
const MASTER_PROMPT = `Your mission is to act as an expert prompt engineer for AI image generators like Midjourney or Stable Diffusion. Analyze the uploaded image with extreme detail. Generate a single, coherent, and rich descriptive prompt that can replicate the image. 
**CRITICAL CONSTRAINT: The final output prompt must NOT exceed 70 words. This is a strict limit. Be concise, impactful, and stay strictly within the word limit.**
Focus on subject, environment, art style, composition, lighting, and color palette. End with powerful keywords like "highly detailed, 4k, cinematic". Output ONLY the final, ready-to-use prompt.`;

// إعدادات السلامة
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// --- "العقل الذكي": الدالة التي ستتعامل مع الطلبات ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // التأكد من أن مفتاح API موجود ومُعد في Vercel
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
    return res.status(500).json({ error: "Server configuration error. The API key is missing." });
  }

  // التأكد من أن الطلب هو من نوع POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: 'Missing image data.' });
    }
    
    // تهيئة النسخة الرئيسية من GoogleGenerativeAI
    const genAI = new GoogleGenerativeAI(apiKey);
    const imagePart: Part = { inlineData: { data: imageBase64, mimeType } };
    const requestParts: Part[] = [imagePart, { text: MASTER_PROMPT }];

    // --- حلقة الانتقال التلقائي بين النماذج ---
    for (const modelName of MODEL_FALLBACK_CHAIN) {
      try {
        console.log(`[API] Attempting to generate content with model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: requestParts }],
          safetySettings,
        });

        const promptText = result.response.text();
        if (!promptText) {
          throw new Error("Received an empty response from the AI model.");
        }
        
        console.log(`[API] Success with model: ${modelName}`);
        // عند النجاح، أرسل النتيجة إلى الواجهة الأمامية وأوقف التنفيذ
        return res.status(200).json({ prompt: promptText });

      } catch (err: any) {
        const errorString = String(err);
        console.error(`[API] Error with model ${modelName}:`, errorString);

        // إذا كان الخطأ بسبب انتهاء الباقة، انتقل للموديل التالي بصمت
        if (errorString.includes('quota') || errorString.includes('429')) {
          continue; 
        }
        
        // ارمي الخطأ للخارج ليتم التقاطه في الـ catch الرئيسية
        throw err;
      }
    }
    
    // إذا انتهت الحلقة ولم ينجح أي موديل
    console.error("[API] All models failed due to quota exhaustion.");
    return res.status(503).json({ error: "The tool is currently experiencing high demand. Please try again in a few minutes." });

  } catch (err: any) {
    // --- نظام رسائل الأخطاء الاحترافي ---
    const errorString = String(err);

    if (errorString.includes('API key not valid')) {
      return res.status(500).json({ error: "Tool is currently under re-activation. Please try again in 1 minute." });
    }
    if (errorString.includes('400')) {
      return res.status(400).json({ error: "Invalid request. The AI model configuration is incorrect. Please contact support." });
    }
    
    // لأي خطأ آخر غير متوقع
    return res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
}
