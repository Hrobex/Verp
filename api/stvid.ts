// الملف: api/stvid.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- 1. الثوابت المشتركة بين الأداتين ---
const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc";

const SHARED_SAFETY_SETTINGS = [
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

/**
 * دالة مساعدة للتحقق من اللغة بشكل دفاعي.
 */
function getLanguageSafe(language: any, req: VercelRequest): { name: string, code: string } {
    if (!language || !language.code || !language.name) {
        console.warn(`WARNING: Language object not provided by frontend. Defaulting to English. Request from IP: ${req.socket.remoteAddress}`);
        return { name: 'English', code: 'en' };
    }
    return language;
}


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
    if (!imageData || !mimeType) {
        return res.status(400).json({ error: 'Missing imageData or mimeType.' });
    }

    const currentLanguage = getLanguageSafe(language, req);
    const masterPrompt = getStoryMasterPrompt(currentLanguage.name, currentLanguage.code);
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

// المطالبة الأساسية (بدون الموجه السلبي)
function getStandardVideoPrompt(languageName: string, languageCode: string): string {
    let prompt = `
Act as an elite prompt engineer and a master cinematographer. Your task is to analyze the provided image and write a single, powerful, and concise video prompt that brings it to life. The entire output must be a single, flowing paragraph. It must seamlessly blend these elements:
1. Core Subject & Action: Start with the main subject and describe a primary action.
2. Environmental Dynamics: Describe the environment and infuse it with motion.
3. Cinematic Camera Work: Specify ONE clear camera movement.
4. Atmosphere & Light: Detail the lighting and mood with evocative terms.
5. Artistic Style: Conclude with the overall aesthetic (e.g., "Photorealistic, 4K, cinematic").
`;
    if (languageCode !== 'en') {
      prompt += ` **CRITICAL FINAL INSTRUCTION: Your entire response MUST be written fluently in: ${languageName}.**`;
    }
    return prompt;
}

// المطالبة الحصرية (مع الموجه السلبي)
function getExclusiveVideoPrompt(languageName: string, languageCode: string): string {
    let prompt = `
Act as an elite prompt engineer and a master cinematographer. Your task is to deconstruct the provided image into its most granular cinematic components and then synthesize them into a single, comprehensive, and powerful paragraph optimized for advanced text-to-video models like Veo.
The final paragraph must be dense with detail and seamlessly weave together the following critical elements:
A. Scene Framing & Technicals: Specify the aspect ratio (e.g., 'A 16:9 aspect ratio shot'), the desired FPS (e.g., 'at 24fps'), and the overall visual style (e.g., 'in a photorealistic, cinematic style').
B. Core Subject & Detailed Action: Describe the main subject with rich adjectives. Detail their primary action and any subtle secondary movements.
C. Environment & Background Dynamics: Describe the surrounding environment and background, infusing it with life by describing dynamic elements (e.g., 'wind rustling leaves').
D. Cinematic Camera Work: Specify ONE clear camera movement (e.g., 'slow zoom in') and qualify it with its motion intensity (e.g., 'with low motion intensity').
E. Lighting, Mood, & Color Palette: Detail the lighting conditions (e.g., 'lit by the warm, soft glow of golden hour'), define the mood (e.g., 'evoking a sense of nostalgia'), and specify the dominant color palette.
F. Negative Prompt Clause: Conclude with 'Negative prompt:' followed by elements to avoid (e.g., 'Negative prompt: avoid blurry visuals, distorted anatomy.').
The entire output must be a single, flowing paragraph. Do not use headings or bullet points in the final response.
`;
    if (languageCode !== 'en') {
      prompt += ` **CRITICAL FINAL INSTRUCTION: Your entire response, the final detailed video prompt, MUST be written fluently in: ${languageName}.**`;
    }
    return prompt;
}

async function handleVideoPromptGenerator(req: VercelRequest, res: VercelResponse) {
    const { imageData, mimeType, language, withNegativePrompt } = req.body;
    if (!imageData || !mimeType) {
        return res.status(400).json({ error: 'Missing imageData or mimeType.' });
    }
    
    const currentLanguage = getLanguageSafe(language, req);
    
    const masterPrompt = withNegativePrompt
        ? getExclusiveVideoPrompt(currentLanguage.name, currentLanguage.code)
        : getStandardVideoPrompt(currentLanguage.name, currentLanguage.code);

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
