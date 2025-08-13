import { Link } from 'react-router-dom';
import { BrainCircuit, BookOpen, ShieldCheck, Infinity, Edit2, Download, Save, Code } from 'lucide-react';

const faqData = [
  {
    question: "هل Llama-4 مجاني حقًا للاستخدام؟",
    answer: "نعم، بشكل كامل ومطلق. نحن نؤمن بأن أدوات الذكاء الاصطناعي القوية يجب أن تكون متاحة للجميع. لا توجد اشتراكات، ولا رسوم خفية، ولا حدود على عدد المحادثات التي يمكنك إجراؤها."
  },
  {
    question: "ما الذي يميز Llama-4 عن غيره من برامج الشات؟",
    answer: "Llama-4 يجمع بين عدة مزايا فريدة: فهو يستخدم نماذج لغوية ضخمة تمنحه قدرة استثنائية على الفهم والاستدلال، ويمتلك ذاكرة واسعة لتتبع سياق المحادثات الطويلة، كل ذلك مقدم في تجربة دردشة بالذكاء الاصطناعي مجانًا وبدون الحاجة للتسجيل."
  },
  {
    question: "ما نوع المهام التي يتفوق فيها Llama-4؟",
    answer: "إنه شريك متعدد الاستخدامات بشكل كبير. يمكنك استخدامه كشريك في العصف الذهني، أو كمساعد في كتابة المحتوى والبريد الإلكتروني، أو لحل مسائل منطقية وبرمجية معقدة، أو حتى لترجمة النصوص وتلخيص المستندات الطويلة."
  },
  {
    question: "هل محادثاتي آمنة وخاصة؟",
    answer: "نعم. خصوصيتك وأمانك هما أولويتنا القصوى. نحن لا نخزن سجل محادثاتك على خوادمنا—أبدًا. يتم حفظ محادثتك مباشرة وفقط في التخزين المحلي لمتصفحك، مما يمنحك راحة استئناف المحادثة من حيث توقفت دون أن تغادر بياناتك جهازك على الإطلاق."
  }
];

function Llama4PageAr() {
  return (
    <>
      <title>Llama-4: شات ذكاء اصطناعي مجاني وغير محدود</title>
      <meta name="description" content="جرّب Llama-4، مساعد الذكاء الاصطناعي من الجيل الجديد. اطرح أسئلة معقدة، أنشئ محتوى، واحصل على إجابات فورية. مجاني تمامًا وبدون الحاجة للتسجيل." />
      <link rel="canonical" href="https://aiconvert.online/ar/llama-4" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/llama-4" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/llama-4" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/llama-4" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Llama-4: شات ذكاء اصطناعي مجاني",
            "description": "شات ذكاء اصطناعي مجاني وغير محدود مدعوم بنماذج متقدمة. يقدم Llama-4 قدرة فائقة على الاستدلال، ذاكرة سياق واسعة، وتجربة محادثة خاصة للكتابة، البرمجة، وحل المشكلات المعقدة.",
            "operatingSystem": "WEB",
            "applicationCategory": "ProductivityApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "applicationSuite": "AI Convert Online Tools"
          }
        `}
      </script>

      <div className="pt-24 bg-gray-900 text-white min-h-screen font-sans">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

          <section className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-500">
              Llama-4: شات الذكاء الاصطناعي المجاني
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
              تجاوز حدود المألوف. حان الوقت لتجربة مساعد ذكاء اصطناعي يفهم حقًا ما تريد. اطرح أسئلة معقدة، أنشئ محتوى إبداعيًا، واحصل على إجابات فورية وذكية.
            </p>
          </section>

          <div className="text-center mb-20">
            <Link
              to="/ar/llama-4/chat"
              className="inline-block py-4 px-10 text-lg font-bold text-gray-900 bg-amber-500 rounded-full shadow-lg hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300 transform hover:scale-105 transition-all duration-300"
            >
              ابدأ الدردشة الآن مجانًا
            </Link>
            <p className="mt-4 text-sm text-gray-300">لا يتطلب أي تسجيل.</p>
          </div>

          <section className="text-center mb-24">
            <h2 className="text-3xl font-bold mb-4">مساعد ذكاء اصطناعي بقدرات استثنائية</h2>
            <p className="max-w-3xl mx-auto text-gray-400 mb-12">
              لم نكتفِ بتقديم بوت دردشة آخر، بل صممنا تجربة Llama-4 ليكون شريكك في التفكير والإبداع.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-emerald-500/20 transition-shadow">
                <BrainCircuit className="h-10 w-10 mx-auto mb-4 text-emerald-400" />
                <h3 className="text-xl font-bold text-white mb-2">استدلال منطقي متقدم</h3>
                <p className="text-gray-300">تَحَدَّهُ بأعقد مشكلاتك. بفضل قدرته على فهم السياق المعقد، يقدم Llama-4 حلولاً منطقية ومبنية على تحليل عميق.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-emerald-500/20 transition-shadow">
                <BookOpen className="h-10 w-10 mx-auto mb-4 text-emerald-400" />
                <h3 className="text-xl font-bold text-white mb-2">ذاكرة سياق واسعة</h3>
                <p className="text-gray-300">هل سئمت من تكرار نفسك؟ يتذكر Llama-4 تفاصيل محادثاتك الطويلة، مما يجعله مثاليًا لمتابعة المشاريع وتلخيص النصوص.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-emerald-500/20 transition-shadow">
                <ShieldCheck className="h-10 w-10 mx-auto mb-4 text-emerald-400" />
                <h3 className="text-xl font-bold text-white mb-2">موثوقية تامة</h3>
                <p className="text-gray-300">يعمل نظامنا الذكي على التبديل بين عدة نماذج قوية لضمان استمرارية الخدمة وحصولك دائمًا على أفضل إجابة ممكنة.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-emerald-500/20 transition-shadow">
                <Infinity className="h-10 w-10 mx-auto mb-4 text-emerald-400" />
                <h3 className="text-xl font-bold text-white mb-2">مجاني وبلا حدود</h3>
                <p className="text-gray-300">أطلق العنان لإبداعك. استمتع بتجربة دردشة مجانية بالذكاء الاصطناعي، بدون القلق بشأن التكاليف أو الحصص.</p>
              </div>
            </div>
          </section>

          <section className="text-center mb-24">
            <h2 className="text-3xl font-bold mb-4">تجربة محادثة مصممة خصيصًا لك</h2>
            <p className="max-w-3xl mx-auto text-gray-400 mb-12">
              لقد ركزنا على التفاصيل الدقيقة لإنشاء واجهة ليست قوية فحسب، بل سهلة الاستخدام وممتعة أيضًا.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-amber-500/20 transition-shadow">
                <Edit2 className="h-10 w-10 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold text-white mb-2">التعديل والتنقيح</h3>
                <p className="text-gray-300">هل أخطأت في الكتابة؟ عدّل أيًا من رسائلك السابقة بسهولة وأعد توليد رد جديد لتصل بمحادثتك إلى الكمال.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-amber-500/20 transition-shadow">
                <Download className="h-10 w-10 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold text-white mb-2">تصدير محادثاتك</h3>
                <p className="text-gray-300">احتفظ بسجل دائم لأفكارك الرائعة. قم بتصدير محادثتك بالكامل كملف ماركداون منظم بنقرة واحدة من قائمة الخيارات.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-amber-500/20 transition-shadow">
                <Save className="h-10 w-10 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold text-white mb-2">لا تفقد سياقك أبدًا</h3>
                <p className="text-gray-300">هل أغلقت النافذة عن طريق الخطأ؟ لا مشكلة. يتم حفظ محادثتك الحالية تلقائيًا في متصفحك، وجاهزة لتكمل من حيث توقفت.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-amber-500/20 transition-shadow">
                <Code className="h-10 w-10 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold text-white mb-2">تنسيق متقدم للنصوص</h3>
                <p className="text-gray-300">يفهم الشات الخاص بنا الأكواد البرمجية والقوائم وغيرها، ويقوم بتنسيقها بشكل جميل، مما يجعل الإجابات المعقدة سهلة القراءة.</p>
              </div>
            </div>
          </section>

          <section className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">أسئلة شائعة</h2>
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-emerald-400 mb-2">{faq.question}</h3>
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </>
  );
}

export default Llama4PageAr;
