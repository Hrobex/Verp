// الملف: api/generate-image-pro.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- البيانات السرية والمنطق التشغيلي ---

// 1. قائمة الأنماط التفصيلية (مخفية الآن في الخلفية)
const styleOptions = [
  { name: 'Default', value: 'default', prompt_suffix: '' },
  { name: 'Cinematic', value: 'cinematic', prompt_suffix: ', cinematic style' },
  { name: 'Photographic', value: 'photographic', prompt_suffix: ', photographic, realistic' },
  { name: 'Anime', value: 'anime', prompt_suffix: ', anime style' },
  { name: 'Digital Art', value: 'digital-art', prompt_suffix: ', digital art' },
  { name: 'Pixel Art', value: 'pixel-art', prompt_suffix: ', pixel art' },
  { name: 'Fantasy Art', value: 'fantasy-art', prompt_suffix: ', fantasy art' },
  { name: 'Neonpunk', value: 'neonpunk', prompt_suffix: ', neonpunk style' },
  { name: '3D Model', value: '3d-model', prompt_suffix: ', 3d model' },
];

// 2. دالة الترجمة (مخفية الآن في الخلفية)
async function translatePrompt(prompt: string): Promise<string> {
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
        const { userPrompt, style, size } = req.body;

        if (!userPrompt || !style || !size) {
            return res.status(400).json({ error: 'Missing required parameters: prompt, style, or size.' });
        }

        const translatedPrompt = await translatePrompt(userPrompt);
        const styleSuffix = styleOptions.find(s => s.value === style)?.prompt_suffix || '';
        const finalPrompt = translatedPrompt + styleSuffix;

        const [width, height] = size.split('x');
        const encodedPrompt = encodeURIComponent(finalPrompt);
        const seed = Date.now();
        const constructedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=${width}&height=${height}&seed=${seed}&nologo=true`;

        return res.status(200).json({ imageUrl: constructedUrl });

    } catch (error) {
        console.error("Backend error in generate-image-pro:", error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
