// الملف: api/video-prompt-generator.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc";

// النموذج المستهدف للتجربة الأولية
const TARGET_MODEL = "gemini-2.5-pro"; 

// إعدادات الأمان
const SAFETY_SETTINGS = [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" }, // قد نحتاج لتخفيفها لوصف مشاهد أكشن
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

// التعليمات السرية للذكاء الاصطناعي (Master Prompt)
const getMasterPrompt = (languageName: string, languageCode: string): string => {
    let masterPrompt = `
You are a world-class prompt engineer and a visionary cinematographer, specializing in creating prompts for cutting-edge text-to-video AI models like Sora, Runway, and Pika.
Your task is to analyze the provided static image and write a single, powerful, and concise video prompt that brings it to life.

The generated prompt MUST be structured as a single paragraph.

It must seamlessly blend the following elements:
1.  **Core Subject & Action:** Start with the main subject. Describe a subtle, primary action (e.g., "A woman with red hair looks up...", "A vintage car cruises down...").
2.  **Environmental Dynamics:** Describe the environment and infuse it with motion. Leaves rustle, clouds drift, rain streaks down a window, city lights blur, steam rises.
3.  **Cinematic Camera Work:** Specify ONE clear camera movement that enhances the scene (e.g., "slow zoom in," "gentle panning shot to the right," "dramatic dolly out," "low-angle shot rising slowly").
4.  **Atmosphere & Light:** Detail the lighting and mood. Use evocative terms like "golden hour sunlight filtering through the trees," "moody neon glow reflecting on wet pavement," "soft, ethereal morning mist," "dramatic, long shadows."
5.  **Artistic Style:** Conclude with the overall aesthetic. Use terms like "Photorealistic, 4K, cinematic," "Hyper-detailed, octane render," "Vintage 16mm film look," "Dreamy, fantastical animation."

**EXAMPLE INPUT (Image of a cat on a windowsill):**
**EXAMPLE OUTPUT:** A fluffy ginger cat sitting on a wooden windowsill, its tail twitches gently as it watches dust particles dance in a sunbeam. Slow zoom in, focusing on its blinking green eyes. The scene is bathed in warm, lazy afternoon light, creating a feeling of peacefulness. Photorealistic, 4K, cinematic detail.

Now, analyze the user's image and generate the perfect video prompt based on these rules.
`;

    // تعديل للغات الأخرى
    if (languageCode !== 'en') {
      masterPrompt += ` **CRITICAL FINAL INSTRUCTION: Your entire response, the final video prompt, MUST be written fluently in the following language: ${languageName}. Do not translate the example, just follow the structure.**`;
    }
    return masterPrompt;
};


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // لاحظ أننا لم نعد نحتاج إلى language هنا، ولكن قد نضيفها لاحقًا
        const { imageData, mimeType, language } = req.body;

        if (!imageData || !mimeType) {
            return res.status(400).json({ error: 'Missing imageData or mimeType.' });
        }
        
        // استخدام اللغة إذا كانت متاحة، وإلا الافتراضي هو الإنجليزية
        const currentLanguage = language || { name: 'English', code: 'en' };
        const masterPrompt = getMasterPrompt(currentLanguage.name, currentLanguage.code);

        const requestBody = {
            contents: [{
                role: "user",
                parts: [
                    { inline_data: { mime_type: mimeType, data: imageData } },
                    { text: masterPrompt }
                ]
            }],
            safetySettings: SAFETY_SETTINGS,
            // يمكن إضافة إعدادات الجيل هنا إذا أردنا تحكمًا أدق
            generationConfig: {
                "temperature": 0.8,
                "topP": 0.95,
            }
        };

        const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${TARGET_MODEL}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const responseData = await apiResponse.json();
        
        if (!apiResponse.ok) {
            const errorMsg = responseData.error?.message || `API Error with ${TARGET_MODEL}`;
            console.error("API Error:", errorMsg);
            return res.status(502).json({ error: errorMsg });
        }
        
        const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (generatedText && generatedText.trim()) {
            // الاستجابة هنا هي prompt الفيديو
            return res.status(200).json({ videoPrompt: generatedText.trim() });
        } else {
            const errorMessage = responseData.candidates?.[0]?.finishReason || "The AI model returned an empty response.";
            console.error("Empty response from model, reason:", errorMessage);
            return res.status(502).json({ error: `The AI failed to generate a prompt. Reason: ${errorMessage}` });
        }

    } catch (error: any) {
        console.error("Video Prompt Generator backend error:", error.message);
        return res.status(500).json({ error: 'A critical server error occurred.' });
    }
}
