// الملف: api/tools.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';

// --- قائمة الأسرار: كل الروابط السرية في مكان واحد ---
const API_LINKS = {
  'face-merge': 'https://asartb-fs.hf.space/swap_faces/',
  'lineartify': 'https://asartb-lld.hf.space/predict/',
  'background-remover': 'https://asartb-brcbd.hf.space/process-image/',
  'digicartoony': 'https://makhinur-angusad.hf.space/inference/',
  'image-enhancer': 'https://makhinur-furd.hf.space/upload/',
  'cartoonify': 'https://makhinur-cdonn.hf.space/cartoonize/',
  // أضف أي أدوات مستقبلية هنا
};

// --- إعدادات Vercel (مرة واحدة هنا) ---
export const config = {
  api: {
    bodyParser: false,
  },
};

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
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 1. تحديد الأداة المطلوبة من الرابط (e.g., /api/tools?tool=face-merge)
        const toolName = req.query.tool as keyof typeof API_LINKS;

        if (!toolName || !API_LINKS[toolName]) {
            return res.status(400).json({ error: 'Invalid or missing tool name.' });
        }

        const { fields, files } = await parseForm(req);

        // 2. إعادة بناء FormData ديناميكياً
        const externalApiFormData = new FormData();
        for (const key in files) {
            const file = files[key]?.[0];
            if (file) {
                externalApiFormData.append(key, new Blob([fs.readFileSync(file.filepath)]), file.originalFilename || 'file');
            }
        }
        for (const key in fields) {
            const field = fields[key]?.[0];
            if (field) {
                externalApiFormData.append(key, field);
            }
        }
        
        // 3. الاتصال بالخدمة النهائية الصحيحة
        const apiResponse = await fetch(API_LINKS[toolName], {
            method: 'POST',
            body: externalApiFormData,
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            return res.status(apiResponse.status).send(errorText);
        }
        
        // 4. إعادة توجيه الرد (سواء كان صورة أو JSON)
        const contentType = apiResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const responseData = await apiResponse.json();
            return res.status(200).json(responseData);
        } else {
            const imageBuffer = await apiResponse.arrayBuffer();
            res.setHeader('Content-Type', contentType || 'image/png');
            return res.status(200).send(Buffer.from(imageBuffer));
        }

    } catch (error: any) {
        console.error(`Error in tools handler for ${req.query.tool}:`, error.message);
        return res.status(500).json({ error: 'A critical server error occurred.' });
    }
}
