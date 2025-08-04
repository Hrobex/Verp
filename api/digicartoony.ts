// الملف: api/digicartoony.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- البيانات السرية والمنطق التشغيلي ---

// 1. عنوان URL السري لخدمة Hugging Face
const DIGICARTOONY_API_URL = 'https://makhinur-angusad.hf.space/inference/';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // تمرير الطلب كما هو إلى الخدمة السرية
        // هذا يضمن عدم تلف بيانات الصورة (FormData)
        const apiResponse = await fetch(DIGICARTOONY_API_URL, {
            method: 'POST',
            headers: {
                // نمرر نوع المحتوى الأصلي من الطلب القادم من المتصفح
                'Content-Type': req.headers['content-type']!,
            },
            // نمرر جسم الطلب (بيانات FormData) كما هو
            body: req.body,
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error("Hugging Face API Error:", errorText);
            return res.status(apiResponse.status).json({ error: errorText || 'External service failed.' });
        }

        // إعادة توجيه الرد (الصورة الناتجة) كما هو إلى المتصفح
        const resultImageBuffer = await apiResponse.arrayBuffer();
        res.setHeader('Content-Type', apiResponse.headers.get('content-type') || 'image/png');
        res.status(200).send(Buffer.from(resultImageBuffer));

    } catch (error) {
        console.error("DigiCartoony backend error:", error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
