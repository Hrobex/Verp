// الملف: api/generate-prompt.ts (النسخة المصححة)

import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- كل المعلومات السرية تبقى هنا في الخلفية ---
const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc";

const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-latest",
  "gemini-pro-vision"
];

const MASTER_PROMPT = `Your mission is to act as an expert prompt engineer for AI image generators like Midjourney or Stable Diffusion. Analyze the uploaded image with extreme detail. Generate a single, coherent, and rich descriptive prompt that can replicate the image. 
**CRITICAL CONSTRAINT: The final output prompt must NOT exceed 70 words. This is a strict limit. Be concise, impactful, and stay strictly within the word limit.**
Focus on subject, environment, art style, composition, lighting, and color palette. End with powerful keywords like "highly detailed, 4k, cinematic". Output ONLY the final, ready-to-use prompt.`;

const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageData, mimeType } = req.body;

    if (!imageData || !mimeType) {
      return res.status(400).json({ error: 'Image data and mimeType are required.' });
    }

    let finalResultText: string | null = null;
    let lastError: any = null;

    for (const modelName of MODEL_FALLBACK_CHAIN) {
      try {
        console.log(`Backend: Attempting model ${modelName}`);

        // ======================= التغيير الرئيسي هنا =======================
        // تصحيح بنية الطلب لتتطابق تمامًا مع ما يتوقعه Google REST API.
        // تمت إضافة `role: "user"` التي كانت مفقودة.
        const requestBody = {
          contents: [{
            role: "user", // هذا هو الجزء المهم الذي تم تصحيحه
            parts: [
              { inline_data: { mime_type: mimeType, data: imageData } },
              { text: MASTER_PROMPT }
            ]
          }],
          safetySettings: SAFETY_SETTINGS,
        };
        // ===================== نهاية منطقة التغيير =======================

        const apiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          }
        );

        const responseData = await apiResponse.json();

        if (!apiResponse.ok) {
            // الآن سيتم تسجيل خطأ Google بشكل صحيح
            console.error(`Google API Error for ${modelName}:`, responseData);
            throw new Error(responseData.error?.message || 'Google API returned an error');
        }
        
        const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (generatedText && generatedText.trim()) {
          finalResultText = generatedText.trim();
          console.log(`Backend: Success with model ${modelName}`);
          break;
        } else {
            throw new Error(`Empty response text from model ${modelName}`);
        }

      } catch (error) {
        lastError = error;
        console.error(`Backend Error with model ${modelName}:`, error instanceof Error ? error.message : String(error));
      }
    }

    if (finalResultText) {
      return res.status(200).json({ generatedPrompt: finalResultText });
    } else {
      console.error('Backend: All AI models failed.', lastError);
      // إرسال رسالة خطأ أكثر فائدة للمستخدم
      const errorMessage = lastError?.message?.includes('429') 
          ? "The tool is currently experiencing high demand. Please try again in a few minutes."
          : "The service could not process the image. Please try another image or try again later.";
      return res.status(502).json({ error: errorMessage });
    }

  } catch (error) {
    console.error('Backend: An unexpected server error occurred:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}
