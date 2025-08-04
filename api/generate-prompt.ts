// api/generate-prompt.ts (النسخة النهائية باستخدام مكتبة مثبتة)

import type { VercelRequest, VercelResponse } from '@vercel/node';
// استيراد المكتبة بشكل رسمي بعد أن قامت Vercel بتثبيتها
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-pro-vision"
];

const MASTER_PROMPT = `Your mission is to act as an expert prompt engineer...`; // (نفس الـ prompt الخفي)

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set.");
    return res.status(500).json({ error: "Server configuration error." });
  }

  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: 'Missing image data.' });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const imagePart: Part = { inlineData: { data: imageBase64, mimeType } };
    const requestParts: Part[] = [imagePart, { text: MASTER_PROMPT }];

    for (const modelName of MODEL_FALLBACK_CHAIN) {
      try {
        console.log(`[API] Attempting with model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: requestParts }],
          safetySettings,
        });

        const promptText = result.response.text();
        if (!promptText) {
          throw new Error("Empty response from AI model.");
        }
        
        console.log(`[API] Success with model: ${modelName}`);
        return res.status(200).json({ prompt: promptText });

      } catch (err: any) {
        const errorString = String(err);
        console.error(`[API] Error with ${modelName}:`, errorString);

        if (errorString.includes('quota') || errorString.includes('429')) {
          continue; 
        }
        
        throw err;
      }
    }
    
    console.error("[API] All models failed due to quota exhaustion.");
    return res.status(503).json({ error: "The tool is currently experiencing high demand. Please try again in a few minutes." });

  } catch (err: any) {
    const errorString = String(err);

    if (errorString.includes('API key not valid')) {
      return res.status(500).json({ error: "Tool is currently under re-activation. Please try again in 1 minute." });
    }
    if (errorString.includes('400')) {
      return res.status(400).json({ error: "Invalid request. The AI model configuration is incorrect. Please contact support." });
    }
    
    return res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
}```
أنا
---

**ملف الواجهة الأمامية (`PromptigenPage.tsx`) لا يحتاج إلى أي تغيير.**
