// الملف: api/cartoonify.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- البيانات السرية والمنطق التشغيلي ---

// 1. عنوان URL السري لخدمة Hugging Face
const CARTOONIFY_API_URL = 'https://makhinur-cdonn.hf.space/cartoonize/';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // نستقبل الصورة من الواجهة الأمامية كبيانات Base64
        const { imageData, mimeType, filename } = req.body;
        if (!imageData || !mimeType || !filename) {
            return res.status(400).json({ error: 'Missing required image data.' });
        }

        // تحويل بيانات Base64 مرة أخرى إلى Buffer
        const imageBuffer = Buffer.from(imageData, 'base64');
        const imageBlob = new Blob([imageBuffer], { type: mimeType });
        
        // إنشاء FormData في الخلفية لإرسالها إلى الخدمة السرية
        const formData = new FormData();
        formData.append('file', imageBlob, filename);

        // استدعاء الخدمة السرية
        const apiResponse = await fetch(CARTOONIFY_API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error("Hugging Face API Error:", errorText);
            return res.status(apiResponse.status).json({ error: 'Failed to cartoonify the image. The external service may be down.' });
        }

        // الحصول على الصورة الناتجة وإعادة إرسالها إلى الواجهة الأمامية
        const resultImageBuffer = await apiResponse.arrayBuffer();
        
        // تحديد نوع المحتوى الصحيح للرد
        res.setHeader('Content-Type', apiResponse.headers.get('content-type') || 'image/png');
        res.status(200).send(Buffer.from(resultImageBuffer));

    } catch (error) {
        console.error("Cartoonify backend error:", error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
