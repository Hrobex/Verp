// الملف: api/face-merge.ts (نسخة الوكيل الشفاف الصحيحة)
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- المعلومات الحساسة والمنطق السري ---
// تم إخفاء رابط الخدمة الخارجية هنا
const EXTERNAL_API_URL = 'https://asartb-fs.hf.space/swap_faces/';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // تمرير الطلب كما هو (pass-through) إلى الخدمة السرية
        const apiResponse = await fetch(EXTERNAL_API_URL, {
            method: 'POST',
            headers: {
                // نمرر نوع المحتوى الأصلي من الطلب القادم من المتصفح
                'Content-Type': req.headers['content-type']!,
            },
            // نمرر جسم الطلب (بيانات FormData) كما هو بدون أي معالجة
            body: req.body,
        });

        // التعامل مع الرد من الخدمة الخارجية
        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            return res.status(apiResponse.status).send(errorText || 'External service failed.');
        }

        // إعادة توجيه الرد (الصورة الناتجة) كما هو إلى المتصفح
        const resultImageBuffer = await apiResponse.arrayBuffer();
        res.setHeader('Content-Type', apiResponse.headers.get('content-type') || 'image/png');
        res.status(200).send(Buffer.from(resultImageBuffer));

    } catch (error) {
        console.error("Face-merge backend proxy error:", error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
