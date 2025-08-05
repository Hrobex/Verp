// الملف: api/face-merge.ts (نسخة Base64 المبسطة)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import FormData from 'form-data';

// --- المعلومات الحساسة والمنطق السري ---
// تم إخفاء رابط الخدمة الخارجية هنا
const EXTERNAL_API_URL = 'https://asartb-fs.hf.space/swap_faces/';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. استلام بيانات JSON، Vercel تقوم بتحليلها تلقائيا
    const { 
      sourceImage,         // هذا الآن نص Base64, e.g., "data:image/jpeg;base64,..."
      destinationImage,    // وهذا نص Base64 أيضا
      sourcePersonNumber,
      destinationPersonNumber
    } = req.body;

    if (!sourceImage || !destinationImage) {
      return res.status(400).json({ error: 'Source and destination image data are required.' });
    }

    // 2. تحويل نصوص Base64 مرة أخرى إلى بيانات ثنائية (Buffer)
    const sourceBuffer = Buffer.from(sourceImage.split(',')[1], 'base64');
    const destinationBuffer = Buffer.from(destinationImage.split(',')[1], 'base64');

    // 3. إعادة بناء FormData لإرسالها إلى الخدمة الخارجية التي تتوقع ملفات
    const externalApiFormData = new FormData();
    externalApiFormData.append('source_file', sourceBuffer, { filename: 'source.jpg' });
    externalApiFormData.append('destination_file', destinationBuffer, { filename: 'destination.jpg' });
    externalApiFormData.append('source_face_index', sourcePersonNumber);
    externalApiFormData.append('destination_face_index', destinationPersonNumber);
    
    // 4. الاتصال بالخدمة الخارجية باستخدام الرابط السري وإرسال FormData
    const apiResponse = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      body: externalApiFormData,
    });

    // 5. معالجة الرد وإعادته إلى الواجهة الأمامية كما هو
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      return res.status(apiResponse.status).send(errorText || 'API call to external service failed.');
    }
    
    const imageBuffer = await apiResponse.buffer();
    res.setHeader('Content-Type', apiResponse.headers.get('content-type') || 'image/jpeg');
    return res.status(200).send(imageBuffer);

  } catch (error: any) {
    console.error("Backend Error:", error);
    return res.status(500).json({ error: 'A critical server error occurred.' });
  }
}
