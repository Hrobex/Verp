// الملف: AboutPageAr.tsx
import { Gift, Rocket, Sparkles, MousePointerClick } from 'lucide-react';
import { Link } from 'react-router-dom';

// تعريف المبادئ باللغة العربية
const principles = [
  {
    icon: Gift,
    title: 'مجاني 100%، للجميع',
    description: 'نحن نؤمن بالوصول المفتوح للإبداع. أدواتنا لا تحتوي على تكاليف خفية، أو فئات مدفوعة، أو حدود للاستخدام.'
  },
  {
    icon: Rocket,
    title: 'وصول فوري وبدون تسجيل',
    description: 'خصوصيتك تأتي أولاً. استخدم أدواتنا على الفور دون الحاجة للتسجيل، أو تسجيل الدخول، أو مشاركة البيانات الشخصية.'
  },
  {
    icon: MousePointerClick,
    title: 'بساطة فائقة في التصميم',
    description: 'نحن نصمم كل أداة لتكون سهلة الاستخدام بشكل لا يصدق. لا توجد إعدادات معقدة، فقط نتائج مباشرة وواضحة.'
  },
  {
    icon: Sparkles,
    title: 'جودة فائقة مدعومة بالذكاء الاصطناعي',
    description: 'نعتمد على نماذج ذكاء اصطناعي قوية وحديثة لتقديم نتائج عالية الجودة وموثوقة ومفيدة لجميع مشاريعك.'
  }
];

export default function AboutPageAr() {
  return (
    <>
      <title>عن موقعنا - AIConvert</title>
      <meta name="description" content="تعرف على المهمة والمبادئ وراء موقع AIConvert. نحن ملتزمون بتقديم أدوات ذكاء اصطناعي قوية ومجانية ومتاحة للجميع." />
      <link rel="canonical" href="https://aiconvert.online/ar/about" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/about" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/about" />
      
      <div className="bg-gray-900 text-gray-300 pt-32 pb-20 font-sans">
        <main className="max-w-4xl mx-auto px-6 lg:px-8" dir="rtl">
          
          {/* قسم العنوان */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              عن موقع AIConvert
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              نحو دمقرطة الإبداع بأدوات ذكاء اصطناعي قوية ومجانية.
            </p>
          </div>

          <div className="space-y-16 text-lg leading-relaxed">
            
            {/* قسم قصتنا */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-cyan-500/30 pb-3">قصتنا</h2>
              <div className="space-y-4">
                <p>في عالم يتطور فيه الذكاء الاصطناعي بسرعة، لاحظنا وجود فجوة متزايدة. كانت أقوى الأدوات الإبداعية غالبًا ما تكون محصورة خلف اشتراكات باهظة، أو واجهات معقدة، أو نماذج تسجيل تطلب بيانات لا داعي لها.</p>
                <p>
                  وُلد موقع AIConvert من إيمان بسيط ولكنه قوي: **يجب أن تكون قوة الإبداع في الذكاء الاصطناعي متاحة للجميع، دون أي حواجز.** لقد شرعنا في بناء منصة ليست مجرد مجموعة من الأدوات، بل خدمة عامة للمبدعين والمفكرين وأي شخص لديه فكرة.
                </p>
              </div>
            </section>

            {/* قسم مهمتنا */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-cyan-500/30 pb-3">مهمتنا</h2>
              <blockquote className="border-l-4 border-amber-500 bg-gray-800/50 p-6 rounded-l-lg italic">
                "مهمتنا هي دمقرطة الإبداع من خلال توفير مجموعة شاملة من أدوات الذكاء الاصطناعي عالية الجودة، مجانًا بالكامل، للجميع، وإلى الأبد."
              </blockquote>
            </section>
            
            {/* قسم مبادئنا الأساسية */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-8 border-b-2 border-cyan-500/30 pb-3">مبادئنا الأساسية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {principles.map((principle) => (
                  <div key={principle.title} className="bg-gray-800/50 p-6 rounded-xl flex items-start space-x-reverse space-x-4">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600">
                        <principle.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{principle.title}</h3>
                      <p className="text-gray-400">{principle.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* قسم الدعوة لاتخاذ إجراء */}
            <section className="text-center mt-24">
              <h2 className="text-3xl font-bold text-white">هل أنت مستعد للإبداع؟</h2>
              <p className="text-xl text-gray-400 mt-4 mb-8 max-w-2xl mx-auto">
                جميع أدواتنا في انتظارك. استكشفها الآن وشاهد ما يمكنك إنشاؤه اليوم.
              </p>
              <Link to="/ar#tools" 
              className="inline-block bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg py-4 px-10 rounded-lg hover:shadow-xl hover:shadow-cyan-500/20 transform hover:-translate-y-1 transition-all duration-300">استكشف أدواتنا المجانية</Link>         
            </section>

          </div>
        </main>
      </div>
    </>
  );
}
