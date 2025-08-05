// الملف: api/stvid.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- 1. الثوابت المشتركة بين الأداتين ---
const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc";

const SHARED_SAFETY_SETTINGS = [
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

// --- 2. منطق وثوابت أداة "تحويل الصورة إلى قصة" ---

const storyModelChain = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash-latest",
  "gemini-pro-vision"
];

const storySafetySettings = [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ...SHARED_SAFETY_SETTINGS
];

function getStoryMasterPrompt(languageName: string, languageCode: string): string {
    let prompt = `Act as an expert storyteller and creative writer. Analyze the provided image in immense detail. Identify the characters, their expressions, the setting, the time of day, the overall mood, and any potential actions or conflicts. Use these visual cues to write a compelling, imaginative, and complete story. The story must have a clear beginning, a developing middle, and a satisfying conclusion. Be descriptive and bring the scene to life. There is NO limit on the story length.`;
    if (languageCode !== 'en') {
        prompt += ` **CRITICAL FINAL INSTRUCTION: Your entire response, the story, MUST be written fluently in the following language: ${languageName}.**`;
    }
    return prompt;
}

async function handleStoryGenerator(req: VercelRequest, res: VercelResponse) {
    const { imageData, mimeType, language } = req.body;
    if (!imageData || !mimeType || !language) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }
    
    const masterPrompt = getStoryMasterPrompt(language.name, language.code);
    let finalResultText: string | null = null;
    let lastError: string | null = null;

    for (const modelName of storyModelChain) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ inline_data: { mime_type: mimeType, data: imageData } }, { text: masterPrompt }] }],
                    safetySettings: storySafetySettings
                })
            });
            const responseData = await response.json();
            if (!response.ok) {
                lastError = responseData.error?.message || `API Error with ${modelName}`;
                throw new Error(lastError);
            }
            const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (generatedText && generatedText.trim()) {
                finalResultText = generatedText.trim();
                break;
            } else {
                lastError = `Empty response from ${modelName}`;
            }
        } catch (error: any) {
            console.error(`StoryGen Error with model ${modelName}:`, error.message);
        }
    }

    if (finalResultText) {
        return res.status(200).json({ story: finalResultText });
    } else {
        return res.status(502).json({ error: lastError || "The AI service failed to generate a story. Please try again." });
    }
}


// --- 3. منطق وثوابت أداة "مولد prompt الفيديو" ---

const videoPromptModelChain = [
  "gemini-2.5-pro",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-pro-vision"
];

const videoPromptSafetySettings = [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    ...SHARED_SAFETY_SETTINGS
];

function getVideoPromptMasterPrompt(languageName: string, languageCode: string): string {
    let prompt = `
You are a world-class prompt engineer and a visionary cinematographer, specializing in creating prompts for cutting-edge text-to-video AI models like Sora, Runway, and Pika.
Your task is to analyze the provided static image and write a single, powerful, and concise video prompt that brings it to life.
The generated prompt MUST be structured as a single paragraph.
It must seamlessly blend the following elements:
1.  **Core Subject & Action:** Start with the main subject. Describe a subtle, primary action.
2.  **Environmental Dynamics:** Describe the environment and infuse it with motion.
3.  **Cinematic Camera Work:** Specify ONE clear camera movement.
4.  **Atmosphere & Light:** Detail the lighting and mood with evocative terms.
5.  **Artistic Style:** Conclude with the overall aesthetic (e.g., "Photorealistic, 4K, cinematic").

**EXAMPLE INPUT (Image of a cat on a windowsill):**
**EXAMPLE OUTPUT:** A fluffy ginger cat sitting on a wooden windowsill, its tail twitches gently as it watches dust particles dance in a sunbeam. Slow zoom in, focusing on its blinking green eyes. The scene is bathed in warm, lazy afternoon light, creating a feeling of peacefulness. Photorealistic, 4K, cinematic detail.
`;
    if (languageCode !== 'en') {
      prompt += ` **CRITICAL FINAL INSTRUCTION: Your entire response, the final video prompt, MUST be written fluently in the following language: ${languageName}. Do not translate the example, just follow the structure.**`;
    }
    return prompt;
}

async function handleVideoPromptGenerator(req: VercelRequest, res: VercelResponse) {
    const { imageData, mimeType, language } = req.body;
    if (!imageData || !mimeType) {
        return res.status(400).json({ error: 'Missing imageData or mimeType.' });
    }
    
    const currentLanguage = language || { name: 'English', code: 'en' };
    const masterPrompt = getVideoPromptMasterPrompt(currentLanguage.name, currentLanguage.code);
    let finalResultText: string | null = null;
    let lastErrorForDev: string | null = null;

    for (const modelName of videoPromptModelChain) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ inline_data: { mime_type: mimeType, data: imageData } }, { text: masterPrompt }] }],
                    safetySettings: videoPromptSafetySettings,
                    generationConfig: { "temperature": 0.8, "topP": 0.95 }
                })
            });
            const responseData = await response.json();
            if (!response.ok) {
                lastErrorForDev = responseData.error?.message || `API Error with ${modelName}`;
                throw new Error(lastErrorForDev);
            }
            const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (generatedText && generatedText.trim()) {
                finalResultText = generatedText.trim();
                break;
            } else {
                lastErrorForDev = `Empty response from ${modelName}. Finish Reason: ${responseData.candidates?.[0]?.finishReason}`;
            }
        } catch (error: any) {
            console.error(`VideoPrompt Error with model ${modelName}:`, error.message);
        }
    }

    if (finalResultText) {
        return res.status(200).json({ videoPrompt: finalResultText });
    } else {
        console.error("All models failed for VideoPrompt. Last dev error:", lastErrorForDev);
        return res.status(502).json({ error: "The AI is currently experiencing high demand. Please try again in a moment." });
    }
}


// --- 4. الموجه الرئيسي (Main Handler) ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // تحديد الأداة المطلوبة من الرابط (e.g., /api/gemini-processors?tool=story)
    const tool = req.query.tool as string;

    try {
        switch (tool) {
            case 'story':
                return await handleStoryGenerator(req, res);
            case 'video-prompt':
                return await handleVideoPromptGenerator(req, res);
            default:
                return res.status(400).json({ error: 'Invalid tool specified.' });
        }
    } catch (error) {
        console.error(`Backend error for tool ${tool}:`, error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
