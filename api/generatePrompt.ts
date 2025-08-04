import { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc";
const SCRIPT_URL = "https://esm.run/@google/generative-ai";

const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-pro-vision"
];

const masterPrompt = `Your mission is to act as an expert prompt engineer for AI image generators like Midjourney or Stable Diffusion. Analyze the uploaded image with extreme detail. Generate a single, coherent, and rich descriptive prompt that can replicate the image. 
**CRITICAL CONSTRAINT: The final output prompt must NOT exceed 70 words. This is a strict limit. Be concise, impactful, and stay strictly within the word limit.**
Focus on subject, environment, art style, composition, lighting, and color palette. End with powerful keywords like "highly detailed, 4k, cinematic". Output ONLY the final, ready-to-use prompt.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { base64Image, mimeType } = req.body;

  if (!base64Image || !mimeType) {
    return res.status(400).json({ error: 'Missing image data or MIME type' });
  }

  try {
    const module = await import(SCRIPT_URL);
    const GoogleGenerativeAI = module.GoogleGenerativeAI;
    const { HarmCategory, HarmBlockThreshold } = module;

    const genAI = new GoogleGenerativeAI(API_KEY);

    const imagePart = {
      inlineData: { data: base64Image, mimeType },
    };

    for (let i = 0; i < MODEL_FALLBACK_CHAIN.length; i++) {
      const modelName = MODEL_FALLBACK_CHAIN[i];

      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        const safetySettings = [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [imagePart, { text: masterPrompt }] }],
          safetySettings,
        });

        const promptText = result.response.text();
        if (!promptText) throw new Error("Empty response");

        return res.status(200).json({ prompt: promptText });
      } catch (err: any) {
        const errorStr = String(err);

        if (errorStr.includes('quota') || errorStr.includes('429')) {
          continue; // جرب النموذج التالي
        }

        if (errorStr.includes('API key not valid')) {
          return res.status(403).json({ error: "Invalid API key or service inactive" });
        }

        if (errorStr.includes('400')) {
          return res.status(400).json({ error: "Model configuration error. Contact support." });
        }

        return res.status(500).json({ error: "Unexpected error with model: " + modelName });
      }
    }

    return res.status(503).json({ error: "All models failed. Try again later." });
  } catch (e) {
    console.error("Global error:", e);
    return res.status(500).json({ error: "Internal server error." });
  }
}
