// الملف: api/image-generators.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- البيانات السرية والمنطق التشغيلي (مقسمة لكل أداة) ---

// --- 1. بيانات ومنطق أداة Anime ---
const animeStyleOptions = [
    { id: 'modern', prompt_suffix: ', modern anime style, digital illustration, studio quality, vibrant colors, clean line art, sharp details' },
    { id: 'retro', prompt_suffix: ', 90s anime screenshot, retro art style, cel-shaded, muted colors, subtle film grain, nostalgic aesthetic' },
    { id: 'chibi', prompt_suffix: ', cute chibi style, super deformed, kawaii, clean line art, vibrant, sticker design' },
    { id: 'painterly', prompt_suffix: ', ghibli-inspired art style, beautiful detailed background, painterly, whimsical, soft colors, hand-drawn aesthetic' }
];
async function handleAnimeGenerator(req: VercelRequest, res: VercelResponse) {
    const { userPrompt, styleId, size } = req.body;
    if (!userPrompt || !styleId || !size) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }
    const translatedPrompt = await translatePrompt(userPrompt);
    const styleSuffix = animeStyleOptions.find(s => s.id === styleId)?.prompt_suffix || '';
    const finalPrompt = translatedPrompt + styleSuffix;
    return constructUrlAndRespond(res, finalPrompt, size);
}

// --- 2. بيانات ومنطق أداة Artigen V2 ---
const artigenV2StyleOptions = [
    { id: 'artistic', prompt_suffix: ', masterpiece, digital painting, stylized, intricate details, vibrant colors, high quality' },
    { id: 'cinematic', prompt_suffix: ', masterpiece, concept art, high detail, sharp focus, cinematic lighting' }
];
async function handleArtigenV2Generator(req: VercelRequest, res: VercelResponse) {
    const { userPrompt, styleId, size } = req.body;
    if (!userPrompt || !styleId || !size) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }
    const translatedPrompt = await translatePrompt(userPrompt);
    const styleSuffix = artigenV2StyleOptions.find(s => s.id === styleId)?.prompt_suffix || '';
    const finalPrompt = translatedPrompt + styleSuffix;
    return constructUrlAndRespond(res, finalPrompt, size);
}

// --- 3. بيانات ومنطق أداة Image Pro ---
const imageProStyleOptions = [
  { value: 'default', prompt_suffix: '' },
  { value: 'cinematic', prompt_suffix: ', cinematic style' },
  { value: 'photographic', prompt_suffix: ', photographic, realistic' },
  { value: 'anime', prompt_suffix: ', anime style' },
  { value: 'digital-art', prompt_suffix: ', digital art' },
  { value: 'pixel-art', prompt_suffix: ', pixel art' },
  { value: 'fantasy-art', prompt_suffix: ', fantasy art' },
  { value: 'neonpunk', prompt_suffix: ', neonpunk style' },
  { value: '3d-model', prompt_suffix: ', 3d model' },
];
async function handleImageProGenerator(req: VercelRequest, res: VercelResponse) {
    const { userPrompt, style, size } = req.body; // لاحظ استخدام "style" هنا
    if (!userPrompt || !style || !size) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }
    const translatedPrompt = await translatePrompt(userPrompt);
    const styleSuffix = imageProStyleOptions.find(s => s.value === style)?.prompt_suffix || '';
    const finalPrompt = translatedPrompt + styleSuffix;
    return constructUrlAndRespond(res, finalPrompt, size);
}


// --- 4. الدوال المشتركة (لتجنب التكرار) ---

// دالة الترجمة (مشتركة بين الجميع)
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
        return prompt;
    }
}

// دالة بناء الرابط والرد (مشتركة بين الجميع)
function constructUrlAndRespond(res: VercelResponse, finalPrompt: string, size: string) {
    const [width, height] = size.split('x');
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const seed = Date.now();
    const constructedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=${width}&height=${height}&seed=${seed}&nologo=true`;
    return res.status(200).json({ imageUrl: constructedUrl });
}


// --- 5. الموجه الرئيسي (Handler) ---

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // تحديد الأداة المطلوبة من الرابط
    const tool = req.query.tool as string;

    try {
        switch (tool) {
            case 'anime':
                return await handleAnimeGenerator(req, res);
            case 'artigen-v2':
                return await handleArtigenV2Generator(req, res);
            case 'image-pro':
                return await handleImageProGenerator(req, res);
            default:
                return res.status(400).json({ error: 'Invalid tool specified.' });
        }
    } catch (error) {
        console.error(`Backend error for tool ${tool}:`, error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
