import type { VercelRequest, VercelResponse } from '@vercel/node';

const ORCHESTRATOR_BASE_URL = 'https://pint.aiarabai.com/api';
const GENERIC_USER_FRIENDLY_ERROR = 'Your request encountered an unexpected error. Please wait a few seconds and try again.';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { taskId } = req.query;

    if (!taskId || typeof taskId !== 'string') {
        return res.status(400).json({ error: 'Task ID is required.' });
    }

    try {
        const statusUrl = `${ORCHESTRATOR_BASE_URL}/status/${taskId}`;
        const orchestratorResponse = await fetch(statusUrl);

        if (!orchestratorResponse.ok) {
            const errorText = await orchestratorResponse.text();
            console.error(`Orchestrator status check error for task ${taskId}:`, errorText);
            return res.status(200).json({
                status: 'FAILURE',
                error: GENERIC_USER_FRIENDLY_ERROR
            });
        }
        
        const responseData = await orchestratorResponse.json();

        if (responseData.status === 'FAILURE') {
            console.error(`Task ${taskId} failed on backend. Original error:`, responseData.error);
            responseData.error = GENERIC_USER_FRIENDLY_ERROR;
        }

        return res.status(200).json(responseData);

    } catch (error: any) {
        console.error(`Critical error in check-status for task ${taskId}:`, error.message);
        return res.status(200).json({
            status: 'FAILURE',
            error: GENERIC_USER_FRIENDLY_ERROR
        });
    }
}
