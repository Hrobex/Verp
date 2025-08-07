import { OpenAIStream } from 'ai';

// --- إخبار Vercel بأن هذه دالة حافة ---
export const config = {
  runtime: 'edge',
};

const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const TARGET_MODEL = "llama3-8b-8192";

export default async function handler(req: Request) {
  try {
    // التأكد من أن الطلب من نوع POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    const { messages } = await req.json();

    if (!messages) {
      return new Response(JSON.stringify({ error: 'Missing "messages" in request body' }), { status: 400 });
    }

    const requestBody = {
      model: TARGET_MODEL,
      messages: messages,
      stream: true,
    };

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    // --- إذا فشل الطلب من Groq، أرسل الخطأ مباشرة ---
    if (!response.ok) {
        return response; // أعد إرسال رد الخطأ من Groq كما هو
    }
    
    // --- استخدام مكتبة Vercel للتعامل مع البث ---
    const stream = OpenAIStream(response);

    // أعد البث مباشرة إلى المستخدم
    return new Response(stream, {
        headers: { 'Content-Type': 'text/event-stream' }
    });

  } catch (error) {
    console.error("Critical error in edge function:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
