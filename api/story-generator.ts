// الملف: api/story-generator.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- الأسرار التشغيلية والمنطق المخفي ---
const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc";

// سلسلة النماذج بالترتيب المطلوب
const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash-latest",
  "gemini-pro-vision"
];

// إعدادات الأمان
const SAFETY_SETTINGS = [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

// التعليمات السرية للذكاء الاصطناعي
const getMasterPrompt = (languageName: string, languageCode: string): string => {
    let masterPrompt = `Act as an expert storyteller and creative writer. Analyze the provided image in immense detail. Identify the characters, their expressions, the setting, the time of day, the overall mood, and any potential actions or conflicts. Use these visual cues to write a compelling, imaginative, and complete story. The story must have a clear beginning, a developing middle, and a satisfying conclusion. Be descriptive and bring the scene to life. There is NO limit on the story length.`;

    if (languageCode !== 'en') {
      masterPrompt += ` **CRITICAL FINAL INSTRUCTION: Your entire response, the story, MUST be written fluently in the following language: ${languageName}.**`;
    }
    return masterPrompt;
};


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { imageData, mimeType, language } = req.body;

        if (!imageData || !mimeType || !language) {
            return res.status(400).json({ error: 'Missing required parameters.' });
        }
        
        const masterPrompt = getMasterPrompt(language.name, language.code);
        let finalResultText: string | null = null;
        let lastError: string | null = null;

        for (const modelName of MODEL_FALLBACK_CHAIN) {
            try {
                const requestBody = {
                    contents: [{
                        role: "user",
                        parts: [
                            { inline_data: { mime_type: mimeType, data: imageData } },
                            { text: masterPrompt }
                        ]
                    }],
                    safetySettings: SAFETY_SETTINGS
                };

                const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                const responseData = await apiResponse.json();
                
                if (!apiResponse.ok) {
                    lastError = responseData.error?.message || `API Error with ${modelName}`;
                    throw new Error(lastError);
                }
                
                const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (generatedText && generatedText.trim()) {
                    finalResultText = generatedText.trim();
                    break; // نجحنا، نخرج من الحلقة
                } else {
                    lastError = `Empty response from ${modelName}`;
                }
            } catch (error: any) {
                console.error(`Error with model ${modelName}:`, error.message);
                // نستمر لتجربة النموذج التالي
            }
        }

        if (finalResultText) {
            return res.status(200).json({ story: finalResultText });
        } else {
            return res.status(502).json({ error: lastError || "The AI service failed to generate a story. Please try again." });
        }

    } catch (error: any) {
        console.error("Story Generator backend error:", error.message);
        return res.status(500).json({ error: 'A critical server error occurred.' });
    }
}
