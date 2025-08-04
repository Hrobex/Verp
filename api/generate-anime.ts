// الملف: api/generate-anime.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- البيانات السرية والمنطق التشغيلي ---

// 1. قائمة الأنماط التفصيلية (مخفية الآن في الخلفية)
const animeStyleOptions = [
    { 
        id: 'modern', 
        name: 'Modern Style', 
        prompt_suffix: ', modern anime style, digital illustration, studio quality, vibrant colors, clean line art, sharp details' 
    },
    { 
        id: 'retro', 
        name: '90s Retro', 
        prompt_suffix: ', 90s anime screenshot, retro art style, cel-shaded, muted colors, subtle film grain, nostalgic aesthetic' 
    },
    { 
        id: 'chibi', 
        name: 'Chibi Style', 
        prompt_suffix: ', cute chibi style, super deformed, kawaii, clean line art, vibrant, sticker design' 
    },
    { 
        id: 'painterly', 
        name: 'Painterly', 
        prompt_suffix: ', ghibli-inspired art style, beautiful detailed background, painterly, whimsical, soft colors, hand-drawn aesthetic' 
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
        return prompt; // العودة إلى النص الأصلي إذا فشلت الترجمة
    } catch (err) {
        console.error("Translation API failed, using original prompt:", err);
        return prompt; // العودة إلى النص الأصلي عند حدوث خطأ
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

        // 1. ترجمة الوصف
        const translatedPrompt = await translatePrompt(userPrompt);

        // 2. دمج الوصف مع لاحقة النمط
        const styleSuffix = animeStyleOptions.find(s => s.id === styleId)?.prompt_suffix || '';
        const finalPrompt = translatedPrompt + styleSuffix;

        // 3. بناء رابط الصورة النهائي
        const [width, height] = size.split('x');
        const encodedPrompt = encodeURIComponent(finalPrompt);
        const seed = Date.now();
        const constructedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=${width}&height=${height}&seed=${seed}&nologo=true`;

        // 4. إرسال الرابط النهائي إلى الواجهة الأمامية
        return res.status(200).json({ imageUrl: constructedUrl });

    } catch (error) {
        console.error("Backend error in generate-anime:", error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
