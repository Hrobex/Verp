import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';
import { PassThrough } from 'stream';

// هذا الكائن يربط بين اسم الأداة في موقعك (مثل "cartoonify")
// واسم الخدمة في الخادم الجديد (مثل "cartoonizer").
// يمكنك إضافة باقي الأدوات هنا بنفس الطريقة في المستقبل.
const TOOL_TO_SERVICE_MAP: { [key: string]: string } = {
  'cartoonify': 'cartoonizer',
  'aniface': 'aniface',
  'sketch': 'sketcher',
  'enhancer': 'enhancer'
};

// رابط الخادم الجديد الذي يعمل عليه المنسق
const ORCHESTRATOR_BASE_URL = 'https://pint.aiarabai.com/api';

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
        const toolName = req.query.tool as string;
        const serviceName = TOOL_TO_SERVICE_MAP[toolName];

        if (!serviceName) {
            return res.status(400).json({ error: 'Invalid or missing tool name.' });
        }

        const { files } = await parseForm(req);
        const file = files.file?.[0]; // الخادم يتوقع اسم الحقل "file"

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const formData = new FormData();
        // قراءة الملف كـ Blob وإضافته إلى FormData
        const fileBlob = new Blob([fs.readFileSync(file.filepath)], { type: file.mimetype || 'application/octet-stream' });
        formData.append('file', fileBlob, file.originalFilename || 'uploaded_file');

        // إرسال الطلب إلى الخادم الجديد (المنسق)
        const orchestratorResponse = await fetch(`${ORCHESTRATOR_BASE_URL}/${serviceName}`, {
            method: 'POST',
            body: formData,
        });

        // إذا فشل الخادم الجديد في قبول المهمة، أبلغ المستخدم
        if (!orchestratorResponse.ok) {
            const errorText = await orchestratorResponse.text();
            console.error(`Orchestrator error for ${serviceName}:`, errorText);
            return res.status(orchestratorResponse.status).json({ 
                error: 'Failed to submit job to the processing server.',
                details: errorText 
            });
        }

        // استلام الرد من الخادم الجديد (يجب أن يحتوي على task_id)
        const responseData = await orchestratorResponse.json();

        // إعادة الرد (الذي يحتوي على task_id) إلى واجهة موقعك
        return res.status(202).json(responseData);

    } catch (error: any) {
        console.error(`Error in submit-job handler for ${req.query.tool}:`, error.message);
        return res.status(500).json({ error: 'A critical server error occurred while submitting the job.' });
    }
}
