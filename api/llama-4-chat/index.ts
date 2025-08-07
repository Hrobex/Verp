// --- نستورد ما نحتاجه. لا تقلق، Vercel يعالج هذا تلقائيًا في بيئة Edge ---
import { OpenAIStream, StreamingTextResponse } from 'ai';

// --- إخبار Vercel بأن هذه دالة حافة ---
export const config = {
  runtime: 'edge',
};

// --- الثوابت الأساسية ---
const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// --- يمكننا الآن إعادة إضافة سلسلة التبديل التلقائي بأمان ---
const MODEL_FALLBACK_CHAIN = [
  "llama3-8b-8192", // نبدأ بالنموذج السريع والمستقر
  "llama-3.3-70b-versatile",
  "meta-llama/llama-4-scout-17b-16e-instruct",
];

// --- الدالة الرئيسية ---
export default async function handler(req: Request) {
  try {
    // التأكد من أن الطلب من نوع POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // قراءة "messages" من جسم الطلب
    const { messages } = await req.json();

    if (!messages) {
      return new Response(JSON.stringify({ error: 'Missing "messages" in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let groqResponse: Response | null = null;

    // --- حلقة التبديل التلقائي ---
    for (const model of MODEL_FALLBACK_CHAIN) {
      try {
        console.log(`Attempting model: ${model}`);
        
        const requestBody = {
          model: model,
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
        
        // إذا كان الطلب ناجحًا (حتى لو كان خطأ من المستخدم مثل 4xx)، اعتبره نجاحًا واخرج من الحلقة
        if (response.ok) {
          groqResponse = response;
          console.log(`Successfully connected with model: ${model}`);
          break; // اخرج من الحلقة عند أول نجاح
        } else {
            // سجل الخطأ واستمر في المحاولة مع النموذج التالي
            console.warn(`Model ${model} failed with status: ${response.status}`);
        }

      } catch (error) {
        console.error(`Error trying model ${model}:`, error);
        // استمر في المحاولة مع النموذج التالي في حالة فشل الشبكة
      }
    }

    // --- التحقق من وجود رد ناجح ---
    if (!groqResponse) {
      return new Response(JSON.stringify({ error: 'All AI models are currently unavailable.' }), {
        status: 502, // Bad Gateway
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // --- استخدام مكتبة Vercel للتعامل مع البث ---
    const stream = OpenAIStream(groqResponse);

    // أعد البث مباشرة إلى المستخدم
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error("Critical error in edge function:", error);
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
      }
