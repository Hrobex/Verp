import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';

// --- الكائن المركزي لإعدادات الأدوات (النسخة النهائية) ---
// الآن يحتوي على "endpoint" اختياري لتحديد الوظيفة المطلوبة داخل الخدمة
const TOOL_CONFIG: { [key: string]: { serviceName: string; fieldName: string; endpoint?: string } } = {
  'cartoonify':        { serviceName: 'cartoonizer', fieldName: 'file' },
  'sketch':            { serviceName: 'sketcher',    fieldName: 'img'  },
  'digicartoony':      { serviceName: 'aniface',     fieldName: 'file' },
  'enhancer':          { serviceName: 'enhancer',    fieldName: 'img'  },
  'photo-restoration': { serviceName: 'scratch_remover', fieldName: 'img' }
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

        const { fields, files } = await parseForm(req);
        const uploadedFile = Object.values(files)[0]?.[0];

        if (!uploadedFile) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const formData = new FormData();
        const fileBlob = new Blob([fs.readFileSync(uploadedFile.filepath)], { type: uploadedFile.mimetype || 'application/octet-stream' });
        formData.append(config.fieldName, fileBlob, uploadedFile.originalFilename || 'uploaded_file');

        // --- المنطق السري (تم تحسينه ليكون أكثر دقة) ---
        if (toolName === 'enhancer') {
            const versionMap: { [key: string]: string } = { 'v1.4': 'v1.2', 'v2.1': 'v1.3', 'v3.0': 'v1.4' };
            const userVersion = fields.version?.[0] || 'v3.0'; 
            const backendVersion = versionMap[userVersion] || 'v1.4'; 
            formData.append('version', backendVersion);
            formData.append('scale', '2.0'); 
            delete fields.version;
            delete fields.scale;
        }

        for (const key in fields) {
            const value = fields[key]?.[0];
            if (value) {
                formData.append(key, value);
            }
        }

        // --- بناء الرابط الديناميكي الجديد ---
        let targetUrl = `${ORCHESTRATOR_BASE_URL}/${config.serviceName}`;
        if (config.endpoint) {
            targetUrl += `/${config.endpoint}`;
        }
        // --- نهاية بناء الرابط ---

        const orchestratorResponse = await fetch(targetUrl, {
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
