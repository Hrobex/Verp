// الملف: api/background-remover.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';

// --- البيانات السرية والمنطق التشغيلي ---
const EXTERNAL_API_URL = 'https://asartb-brcbd.hf.space/process-image/';

// إعدادات Vercel للتعامل مع FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

// دالة مساعدة لتفكيك الطلب باستخدام formidable
const parseForm = (req: VercelRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({});
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // تفكيك الطلب القادم من الواجهة الأمامية
        const { files } = await parseForm(req);

        const imageFile = files.file?.[0];

        if (!imageFile) {
            return res.status(400).json({ error: 'Image file is required.' });
        }

        // إعادة بناء طلب FormData جديد ونظيف لإرساله للخدمة النهائية
        const externalApiFormData = new FormData();
        externalApiFormData.append('file', new Blob([fs.readFileSync(imageFile.filepath)]), imageFile.originalFilename || 'image.jpg');

        // الاتصال بالخدمة النهائية
        const apiResponse = await fetch(EXTERNAL_API_URL, {
            method: 'POST',
            body: externalApiFormData,
        });

        // التعامل مع الرد من الخدمة الخارجية
        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error("External API Error:", errorText);
            return res.status(apiResponse.status).send(errorText || 'External service failed.');
        }

        // إعادة توجيه الرد (الصورة الناتجة) كما هو إلى المتصفح
        const resultImageBuffer = await apiResponse.arrayBuffer();
        res.setHeader('Content-Type', apiResponse.headers.get('content-type') || 'image/png');
        res.status(200).send(Buffer.from(resultImageBuffer));

    } catch (error: any) {
        console.error("Background Remover backend error:", error.message);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
