import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash"
];

const masterPrompt = `Your mission is to act as an expert prompt engineer for AI image generators like Midjourney or Stable Diffusion. Analyze the uploaded image with extreme detail. Generate a single, coherent, and rich descriptive prompt that can replicate the image. 
**CRITICAL CONSTRAINT: The final output prompt must NOT exceed 70 words. This is a strict limit. Be concise, impactful, and stay strictly within the word limit.**
Focus on subject, environment, art style, composition, lighting, and color palette. End with powerful keywords like "highly detailed, 4k, cinematic". Output ONLY the final, ready-to-use prompt.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('API Key not found in environment variables.');
      return res.status(500).json({ error: 'Server configuration error: API Key is missing.' });
    }

    const { imageBase64, mimeType } = req.body;
    if (!imageBase64 || !mimeType) {
        return res.status(400).json({ error: 'Missing image data or mimeType in request body.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const imagePart = {
      inlineData: { data: imageBase64, mimeType: mimeType },
    };
    
    for (const modelName of MODEL_FALLBACK_CHAIN) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        // --- هذا هو الجزء الذي تم تصحيحه ---
        const safetySettings = [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [imagePart, { text: masterPrompt }] }],
            safetySettings: safetySettings // استخدام الإعدادات الصحيحة
        });
        
        const promptText = result.response.text();
        if (promptText) {
          return res.status(200).json({ prompt: promptText });
        }
      } catch (error) {
        console.error(`Error with model ${modelName}:`, error);
      }
    }

    return res.status(500).json({ error: 'The tool is currently experiencing high demand or an unexpected error after trying all models. Please try again later.' });

  } catch (error) {
    console.error('General error in handler:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}
