// الملف: api/generate-artigen-v2.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- البيانات السرية والمنطق التشغيلي ---

// 1. قائمة الأنماط الفنية التفصيلية (مخفية الآن في الخلفية)
const artStyleOptions = [
    { 
        id: 'artistic', 
        name: 'Artistic Style', 
        prompt_suffix: ', masterpiece, digital painting, stylized, intricate details, vibrant colors, high quality' 
    },
    { 
        id: 'cinematic', 
        name: 'Cinematic Art', 
        prompt_suffix: ', masterpiece, concept art, high detail, sharp focus, cinematic lighting' 
    }
];

// 2. دالة الترجمة (مخفية الآن في الخلفية)
async function translatePrompt(prompt: string): Promise<string> {
    // التحقق إذا كان النص إنجليزياً بالفعل لتجنب استدعاء API غير ضروري
    if (/^[a-zA-Z0-9\s.,'"+-?!]*$/.test(prompt)) {
        return prompt;
    }
    try {
        const langPair = "ar|en"; 
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(prompt)}&langpair=${langPair}&mt=1`;
        const translateResponse = await fetch(apiUrl);
        if (translateResponse.ok) {
            const translateData = await translateResponse.json();
            if (translateData.responseData?.translatedText) {
                return translateData.responseData.translatedText;
            }
        }
        return prompt;
    } catch (err) {
        console.error("Translation API failed, using original prompt:", err);
        return prompt;
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { userPrompt, styleId, size } = req.body;

        if (!userPrompt || !styleId || !size) {
            return res.status(400).json({ error: 'Missing required parameters: prompt, style, or size.' });
        }

        const translatedPrompt = await translatePrompt(userPrompt);
        const styleSuffix = artStyleOptions.find(s => s.id === styleId)?.prompt_suffix || '';
        const finalPrompt = translatedPrompt + styleSuffix;

        const [width, height] = size.split('x');
        const encodedPrompt = encodeURIComponent(finalPrompt);
        const seed = Date.now();
        const constructedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=${width}&height=${height}&seed=${seed}&nologo=true`;

        return res.status(200).json({ imageUrl: constructedUrl });

    } catch (error) {
        console.error("Backend error in generate-artigen-v2:", error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
