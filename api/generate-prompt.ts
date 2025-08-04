import type { VercelRequest, VercelResponse } from '@vercel/node';

// =================================================================
// ============== المنطقة الآمنة - هذا الكود لا يراه المستخدمون =============
// =================================================================

// 1. مفتاح API السري الخاص بك
const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc";

// 2. قائمة النماذج السرية الخاصة بك
const MODEL_FALLBACK_CHAIN = [
  "gemini-1.5-flash-latest", // تم تحديث القائمة لتبدأ بالنماذج الأحدث والأكثر دعماً للصور
  "gemini-pro-vision"
  // النماذج القديمة مثل "gemini-2.5-flash-lite" قد لا تكون موجودة أو لا تدعم الصور، تم إزالتها للأمان
];

// 3. تعليماتك الرئيسية السرية (Master Prompt)
const MASTER_PROMPT = `Your mission is to act as an expert prompt engineer for AI image generators like Midjourney or Stable Diffusion. Analyze the uploaded image with extreme detail. Generate a single, coherent, and rich descriptive prompt that can replicate the image. 
**CRITICAL CONSTRAINT: The final output prompt must NOT exceed 70 words. This is a strict limit. Be concise, impactful, and stay strictly within the word limit.**
Focus on subject, environment, art style, composition, lighting, and color palette. End with powerful keywords like "highly detailed, 4k, cinematic". Output ONLY the final, ready-to-use prompt.`;

// 4. إعدادات الأمان
const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];


// =================================================================
// ================== نهاية المنطقة الآمنة =========================
// =================================================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // التأكد من أن الطلب من نوع POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageData, mimeType } = req.body;

    // التحقق من المدخلات
    if (!imageData || !mimeType) {
      return res.status(400).json({ error: 'Image data and mimeType are required.' });
    }

    let finalResultText: string | null = null;
    let lastError: any = null;

    // 5. منطق المعالجة الاحتياطية (Fallback) يعمل الآن بأمان في الخلفية
    for (const modelName of MODEL_FALLBACK_CHAIN) {
      try {
        console.log(`Backend: Attempting model ${modelName}`);

        const requestBody = {
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType, data: imageData } },
              { text: MASTER_PROMPT }
            ]
          }],
          safetySettings: SAFETY_SETTINGS,
        };

        const apiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          }
        );

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.json();
            throw new Error(`API Error for ${modelName}: ${JSON.stringify(errorBody)}`);
        }
        
        const data = await apiResponse.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (generatedText && generatedText.trim()) {
          finalResultText = generatedText.trim();
          console.log(`Backend: Success with model ${modelName}`);
          break; // نجح الطلب، اخرج من الحلقة
        } else {
            // حالة استجابة ناجحة لكن بدون محتوى نصي
            throw new Error(`Empty response text from model ${modelName}`);
        }

      } catch (error) {
        lastError = error;
        console.error(`Backend Error with model ${modelName}:`, error instanceof Error ? error.message : String(error));
        // استمر لتجربة النموذج التالي
      }
    }

    if (finalResultText) {
      return res.status(200).json({ generatedPrompt: finalResultText });
    } else {
      // إذا فشلت كل النماذج
      console.error('Backend: All AI models failed.', lastError);
      return res.status(502).json({ error: 'The service is currently unavailable or could not process the image. Please try another image or try again later.' });
    }

  } catch (error) {
    console.error('Backend: An unexpected server error occurred:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}
