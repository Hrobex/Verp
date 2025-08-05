// الملف: api/face-merge.ts (النسخة النهائية الصحيحة)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';

const EXTERNAL_API_URL = 'https://asartb-fs.hf.space/swap_faces/';

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
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);

    const sourceFile = files.source_file?.[0];
    const destinationFile = files.destination_file?.[0];
    const sourceFaceIndex = fields.source_face_index?.[0];
    const destinationFaceIndex = fields.destination_face_index?.[0];

    if (!sourceFile || !destinationFile || !sourceFaceIndex || !destinationFaceIndex) {
      return res.status(400).json({ error: 'All fields and files are required.' });
    }

    // إعادة بناء FormData باستخدام الكلاس المدمج في Node.js
    const externalApiFormData = new FormData();
    externalApiFormData.append('source_file', new Blob([fs.readFileSync(sourceFile.filepath)]), sourceFile.originalFilename || 'source.jpg');
    externalApiFormData.append('destination_file', new Blob([fs.readFileSync(destinationFile.filepath)]), destinationFile.originalFilename || 'destination.jpg');
    externalApiFormData.append('source_face_index', sourceFaceIndex);
    externalApiFormData.append('destination_face_index', destinationFaceIndex);
    
    // استخدام fetch المدمج في Node.js
    const apiResponse = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      body: externalApiFormData,
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return res.status(apiResponse.status).send(errorText);
    }

    const imageBuffer = await apiResponse.arrayBuffer();
    res.setHeader('Content-Type', apiResponse.headers.get('content-type') || 'image/jpeg');
    return res.status(200).send(Buffer.from(imageBuffer));

  } catch (error: any) {
    console.error("Backend Error:", error.message);
    return res.status(500).json({ error: 'A critical server error occurred on proxy.' });
  }
}
