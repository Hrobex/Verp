// الملف: api/image-enhancer.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';

// --- البيانات السرية والمنطق التشغيلي ---
const EXTERNAL_API_URL = 'https://makhinur-furd.hf.space/upload/';

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
        const { fields, files } = await parseForm(req);

        const imageFile = files.file?.[0];
        const version = fields.version?.[0];
        const scale = fields.scale?.[0];

        if (!imageFile || !version || !scale) {
            return res.status(400).json({ error: 'Image file, version, and scale are required.' });
        }

        // إعادة بناء طلب FormData جديد ونظيف لإرساله للخدمة النهائية
        const externalApiFormData = new FormData();
        externalApiFormData.append('file', new Blob([fs.readFileSync(imageFile.filepath)]), imageFile.originalFilename || 'image.jpg');
        externalApiFormData.append('version', version);
        externalApiFormData.append('scale', scale);

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

        // بما أن الخدمة تعيد JSON، نقرأه ونمرره كما هو
        const responseData = await apiResponse.json();
        res.status(200).json(responseData);

    } catch (error: any) {
        console.error("Image Enhancer backend error:", error.message);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
