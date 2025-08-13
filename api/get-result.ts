import type { VercelRequest, VercelResponse } from '@vercel/node';

const ORCHESTRATOR_BASE_URL = 'https://pint.aiarabai.com/api';
const GENERIC_USER_FRIENDLY_ERROR = 'Your request encountered an unexpected error. Please wait a few seconds and try again.';

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
        const resultUrl = `${ORCHESTRATOR_BASE_URL}/result/${taskId}`;
        const orchestratorResponse = await fetch(resultUrl);

        if (!orchestratorResponse.ok) {
            const errorText = await orchestratorResponse.text();
            console.error(`Orchestrator result fetch error for task ${taskId}:`, errorText);
            return res.status(orchestratorResponse.status).json({
                error: GENERIC_USER_FRIENDLY_ERROR
            });
        }
        
        const imageArrayBuffer = await orchestratorResponse.arrayBuffer();
        const imageBuffer = Buffer.from(imageArrayBuffer);
        const contentType = orchestratorResponse.headers.get('content-type');

        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        return res.status(200).send(imageBuffer);

    } catch (error: any) {
        console.error(`Error in get-result handler for task ${taskId}:`, error.message);
        return res.status(500).json({ error: GENERIC_USER_FRIENDLY_ERROR });
    }
}
