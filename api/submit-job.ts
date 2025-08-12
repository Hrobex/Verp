import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';

// هذا الكائن الآن لا يربط فقط باسم الخدمة، بل أيضًا باسم الحقل المتوقع
const TOOL_CONFIG: { [key: string]: { serviceName: string; fieldName: string } } = {
  'cartoonify': { serviceName: 'cartoonizer', fieldName: 'file' },
  'sketch':     { serviceName: 'sketcher',    fieldName: 'img'  },
  'aniface':    { serviceName: 'aniface',     fieldName: 'file' }, // افتراضيًا file، يمكن تغييره لاحقًا
  'enhancer':   { serviceName: 'enhancer',    fieldName: 'file' }  // افتراضيًا file، يمكن تغييره لاحقًا
};

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
        const config = TOOL_CONFIG[toolName];

        if (!config) {
            return res.status(400).json({ error: `Invalid or missing tool name: ${toolName}` });
        }

        const { files } = await parseForm(req);
        
        // --- الجزء الذي تم إصلاحه ---
        // ابحث عن الملف المرفق بغض النظر عن اسمه
        const uploadedFile = Object.values(files)[0]?.[0];

        if (!uploadedFile) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        // --- نهاية الإصلاح ---

        const formData = new FormData();
        const fileBlob = new Blob([fs.readFileSync(uploadedFile.filepath)], { type: uploadedFile.mimetype || 'application/octet-stream' });
        
        // استخدم اسم الحقل الصحيح الذي يتوقعه الخادم
        formData.append(config.fieldName, fileBlob, uploadedFile.originalFilename || 'uploaded_file');

        const orchestratorResponse = await fetch(`${ORCHESTRATOR_BASE_URL}/${config.serviceName}`, {
            method: 'POST',
            body: formData,
        });

        if (!orchestratorResponse.ok) {
            const errorText = await orchestratorResponse.text();
            console.error(`Orchestrator error for ${config.serviceName}:`, errorText);
            return res.status(orchestratorResponse.status).json({ 
                error: 'Failed to submit job to the processing server.',
                details: errorText 
            });
        }

        const responseData = await orchestratorResponse.json();
        return res.status(202).json(responseData);

    } catch (error: any) {
        console.error(`Error in submit-job handler for ${req.query.tool}:`, error.message);
        return res.status(500).json({ error: 'A critical server error occurred while submitting the job.' });
    }
}
