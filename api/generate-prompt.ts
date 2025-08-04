// الملف: api/generate-prompt.ts (النسخة المحدثة لتدعم اللغتين)
import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc";
const MODEL_FALLBACK_CHAIN = [ "gemini-2.5-flash-lite", "gemini-2.0-flash-lite", "gemini-2.5-flash", "gemini-1.5-flash-latest", "gemini-pro-vision" ];
const SAFETY_SETTINGS = [{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }];

// تم نقل التعليمات الرئيسية هنا وأصبحت أكثر ديناميكية
const getMasterPrompt = (language: 'ar' | 'en' | undefined): string => {
  let prompt = `Your mission is to act as an expert prompt engineer for AI image generators like Midjourney or Stable Diffusion. Analyze the uploaded image with extreme detail. Generate a single, coherent, and rich descriptive prompt that can replicate the image. 
**CRITICAL CONSTRAINT: The final output prompt must NOT exceed 70 words. This is a strict limit. Be concise, impactful, and stay strictly within the word limit.**
Focus on subject, environment, art style, composition, lighting, and color palette. End with powerful keywords like "highly detailed, 4k, cinematic". Output ONLY the final, ready-to-use prompt.`;

  // إذا كانت اللغة هي العربية، أضف التعليمات الإضافية
  if (language === 'ar') {
    prompt += ` **CRITICAL FINAL INSTRUCTION: Your entire response MUST be in fluent, modern Arabic.**`;
  }
  
  return prompt;
};


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    try {
        // نستقبل الآن متغير اللغة من الواجهة الأمامية
        const { imageData, mimeType, language } = req.body;

        if (!imageData || !mimeType) { return res.status(400).json({ error: 'Image data and mimeType are required.' }); }

        // تحديد التعليمات بناءً على اللغة المستلمة
        const masterPrompt = getMasterPrompt(language);
        
        let finalResultText = null;
        for (const modelName of MODEL_FALLBACK_CHAIN) {
            try {
                const requestBody = { contents: [{ role: "user", parts: [{ inline_data: { mime_type: mimeType, data: imageData } }, { text: masterPrompt }] }], safetySettings: SAFETY_SETTINGS };
                const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
                const responseData = await apiResponse.json();
                if (!apiResponse.ok) { throw new Error(responseData.error?.message || `API Error`); }
                const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
                if (generatedText && generatedText.trim()) {
                    finalResultText = generatedText.trim();
                    break;
                } else { throw new Error(`Empty response from ${modelName}`); }
            } catch (error) { /* Continue */ }
        }
        if (finalResultText) {
            return res.status(200).json({ generatedPrompt: finalResultText });
        } else {
            const errorMessage = language === 'ar' 
                ? "لم يتمكن الذكاء الاصطناعي من معالجة الصورة. يرجى تجربة صورة أخرى."
                : "The AI service failed to process the image. Please try another image.";
            return res.status(502).json({ error: errorMessage });
        }
    } catch (error) {
         const errorMessage = req.body.language === 'ar'
            ? "حدث خطأ فادح في الخادم."
            : "A critical server error occurred.";
        return res.status(500).json({ error: errorMessage });
    }
}
