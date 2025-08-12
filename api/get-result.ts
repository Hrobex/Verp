import type { VercelRequest, VercelResponse } from '@vercel/node';

// رابط الخادم الجديد الذي يعمل عليه المنسق
const ORCHESTRATOR_BASE_URL = 'https://pint.aiarabai.com/api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { taskId } = req.query;

    if (!taskId || typeof taskId !== 'string') {
        return res.status(400).json({ error: 'Task ID is required.' });
    }

    try {
        // بناء الرابط لجلب النتيجة النهائية من الخادم
        const resultUrl = `${ORCHESTRATOR_BASE_URL}/result/${taskId}`;

        const orchestratorResponse = await fetch(resultUrl);

        // إذا فشل الخادم في إرجاع النتيجة (لأنها غير جاهزة أو المهمة فشلت)
        if (!orchestratorResponse.ok) {
            const errorText = await orchestratorResponse.text();
            console.error(`Orchestrator result fetch error for task ${taskId}:`, errorText);
            return res.status(orchestratorResponse.status).json({
                error: 'Failed to get job result from the processing server.',
                details: errorText
            });
        }
        
        // الخطوة 1: استلام بيانات الصورة الخام كـ ArrayBuffer
        const imageArrayBuffer = await orchestratorResponse.arrayBuffer();
        
        // الخطوة 2: تحويلها إلى Buffer، وهو النوع الذي تتعامل معه Vercel
        const imageBuffer = Buffer.from(imageArrayBuffer);
        
        // الخطوة 3: استلام نوع المحتوى (مثلاً 'image/png') من الخادم
        const contentType = orchestratorResponse.headers.get('content-type');

        // الخطوة 4: ضبط رأس الاستجابة في Vercel ليتطابق مع نوع الصورة
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        // الخطوة 5: إرسال بيانات الصورة الخام مباشرةً إلى المتصفح
        return res.status(200).send(imageBuffer);

    } catch (error: any) {
        console.error(`Error in get-result handler for task ${taskId}:`, error.message);
        return res.status(500).json({ error: 'A critical server error occurred while fetching the job result.' });
    }
}
