// الملف: api/tts-generate.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';

// --- الأسرار التشغيلية ---
const apiEndpoints = ['https://asartb-tsard.hf.space/convert'];
let currentEndpointIndex = 0;
const getNextEndpoint = () => {
    const endpoint = apiEndpoints[currentEndpointIndex];
    currentEndpointIndex = (currentEndpointIndex + 1) % apiEndpoints.length;
    return endpoint;
};

// إعدادات Vercel للتعامل مع FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: VercelRequest): Promise<{ fields: formidable.Fields }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({});
    form.parse(req, (err, fields) => {
      if (err) return reject(err);
      resolve({ fields });
    });
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { fields } = await parseForm(req);
        
        const text = fields.text?.[0];
        const language = fields.language?.[0];
        const gender = fields.gender?.[0];
        const voice = fields.voice?.[0];
        const rate = fields.rate?.[0];
        const pitch = fields.pitch?.[0];

        if (!text || !language || !gender || !voice || !rate || !pitch) {
            return res.status(400).json({ error: 'Missing required parameters.' });
        }
        
        const externalApiFormData = new FormData();
        externalApiFormData.append('text', text);
        externalApiFormData.append('language', language);
        externalApiFormData.append('gender', gender);
        externalApiFormData.append('voice', voice);
        externalApiFormData.append('rate', rate);
        externalApiFormData.append('pitch', pitch);

        const endpoint = getNextEndpoint();
        const apiResponse = await fetch(endpoint, {
            method: 'POST',
            body: externalApiFormData,
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            return res.status(apiResponse.status).send(errorText || 'External service failed.');
        }

        const audioBuffer = await apiResponse.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        res.status(200).send(Buffer.from(audioBuffer));

    } catch (error: any) {
        console.error("TTS Generate backend error:", error.message);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
