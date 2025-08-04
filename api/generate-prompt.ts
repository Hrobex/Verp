// الملف: api/generate-prompt.ts (النسخة التي تجمع بين البنية الصحيحة ومنطقك الأصلي)
import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc";

// ======================= التغيير الرئيسي هنا =======================
// تم إرجاع قائمة النماذج الأصلية والكاملة الخاصة بك، كما طلبت تمامًا.
const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-pro-vision"
];
// ===================== نهاية منطقة التغيير =======================

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
                console.log(`[LOG] Attempting model: ${modelName}`);
                const requestBody = {
                    contents: [{
                        role: "user",
                        parts: [
                            { inline_data: { mime_type: mimeType, data: imageData } },
                            { text: MASTER_PROMPT }
                        ]
                    }],
                    safetySettings: SAFETY_SETTINGS,
                };
                
                const apiResponse = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
                    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
                );
                
                const responseData = await apiResponse.json();

                if (!apiResponse.ok) {
                    const errorMessage = responseData.error?.message || `Google API returned status ${apiResponse.status}`;
                    throw new Error(errorMessage);
                }
                
                const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

                if (generatedText && generatedText.trim()) {
                    finalResultText = generatedText.trim();
                    console.log(`[SUCCESS] with model: ${modelName}`);
                    break;
                } else {
                    throw new Error(`Empty response from ${modelName}`);
                }

            } catch (error) {
                lastError = error;
                console.error(`[ERROR] with model ${modelName}:`, error instanceof Error ? error.message : String(error));
            }
        }

        if (finalResultText) {
            return res.status(200).json({ generatedPrompt: finalResultText });
        } else {
            console.error("[FAIL] All models failed. Last error:", lastError);
            return res.status(502).json({ error: "The AI service failed to process the image. Please try a different image or try again later." });
        }

    } catch (error) {
        console.error("[CRITICAL] Server error:", error);
        return res.status(500).json({ error: 'A critical server error occurred.' });
    }
}
