import type { VercelRequest, VercelResponse } from '@vercel/node';

// رابط الخادم الجديد الذي يعمل عليه المنسق
const ORCHESTRATOR_BASE_URL = 'https://pint.aiarabai.com/api';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { taskId } = req.query;

    if (!taskId || typeof taskId !== 'string') {
        return res.status(400).json({ error: 'Task ID is required.' });
    }

    try {
        // بناء الرابط لسؤال الخادم عن حالة المهمة
        const statusUrl = `${ORCHESTRATOR_BASE_URL}/status/${taskId}`;

        const orchestratorResponse = await fetch(statusUrl);

        // إذا فشل الخادم في العثور على المهمة أو حدث خطأ آخر
        if (!orchestratorResponse.ok) {
            const errorText = await orchestratorResponse.text();
            console.error(`Orchestrator status check error for task ${taskId}:`, errorText);
            return res.status(orchestratorResponse.status).json({
                error: 'Failed to get job status from the processing server.',
                details: errorText
            });
        }
        
        // استلام الرد من الخادم (يحتوي على status, queue_position, etc.)
        const responseData = await orchestratorResponse.json();

        // إعادة الرد كما هو إلى واجهة موقعك
        return res.status(200).json(responseData);

    } catch (error: any) {
        console.error(`Error in check-status handler for task ${taskId}:`, error.message);
        return res.status(500).json({ error: 'A critical server error occurred while checking job status.' });
    }
}
