// لا يوجد أي استيراد لمكتبة "ai" الخارجية
// الكود مكتفٍ ذاتيًا ويعمل في بيئة Vercel Edge

export const config = {
  runtime: 'edge',
};

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// --- قائمة النماذج التي سيتم تجربتها بالترتيب ---
const MODEL_FALLBACK_CHAIN = [
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "llama3-8b-8192",          // نبدأ بالنموذج السريع والمستقر
  "gemma2-9b-it",              // نموذج جوجل القوي كخيار ثانٍ
  "llama3-70b-8192"         // النموذج الأكبر كخيار ثالث
];

export default async function handler(req: Request) {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    const { messages } = await req.json();
    if (!messages) {
      return new Response(JSON.stringify({ error: 'Missing "messages"' }), { status: 400 });
    }

    let groqResponse: Response | null = null;

    // --- حلقة التبديل التلقائي (نفس منطق ملفك العامل) ---
    for (const model of MODEL_FALLBACK_CHAIN) {
      try {
        console.log(`Attempting to connect with model: ${model}`);
        
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
        
        // إذا نجح الطلب، قم بتخزين الاستجابة واخرج من الحلقة
        if (response.ok) {
          groqResponse = response;
          console.log(`Successfully connected with model: ${model}`);
          break; // أهم خطوة: الخروج من الحلقة عند أول نجاح
        } else {
          // إذا فشل الطلب (مثل 429 Too Many Requests)، سجل الخطأ واستمر
          console.warn(`Model ${model} failed with status: ${response.status}`);
        }

      } catch (error) {
        // إذا فشل الاتصال بالكامل (مشكلة شبكة)، سجل الخطأ واستمر
        console.error(`A network error occurred while trying model ${model}:`, error);
      }
    }

    // --- التحقق من وجود رد ناجح بعد انتهاء الحلقة ---
    if (!groqResponse) {
      // إذا فشلت كل النماذج في السلسلة
      return new Response(JSON.stringify({ error: 'All AI models are currently unavailable. Please try again later.' }), {
        status: 502, // Bad Gateway
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // --- منطق البث اليدوي (يعمل الآن على الاستجابة الناجحة) ---
    const stream = new ReadableStream({
      async start(controller) {
        if (!groqResponse.body) {
          controller.close();
          return;
        }
        const reader = groqResponse.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      }
    });

  } catch (error) {
    console.error("Critical error in edge function:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
