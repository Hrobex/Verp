// api/generate-prompt.ts (كود التشخيص المؤقت)

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // 1. نتأكد أن الطلب من نوع POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. نطبع رسالة في سجلات Vercel لنؤكد أننا وصلنا إلى هنا
  console.log('[DIAGNOSTIC] API endpoint was hit successfully.');

  // 3. نرسل رد JSON ناجح وثابت، بغض النظر عن أي شيء آخر
  try {
    res.status(200).json({
      prompt: "This is a successful connection test from the server. If you see this, the infrastructure is working correctly."
    });
  } catch (e) {
    // إذا فشل حتى هذا الرد البسيط، فهناك مشكلة كبيرة
    console.error('[DIAGNOSTIC] Failed to send simple response:', e);
    // لا نرسل شيئًا، لنرى إذا كان هذا هو سبب الانهيار
  }
}
