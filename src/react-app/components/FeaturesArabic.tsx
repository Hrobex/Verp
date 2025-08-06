// الملف: src/react-app/components/FeaturesArabic.tsx
import { 
  Shield, 
  Rocket, 
  Sparkles, 
  Layers,
  Gift,
  MousePointerClick,
  Languages, // أيقونة جديدة لدعم اللغات
  Users
} from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'صندوق أدوات متنوع',
    description: 'من توليد الصور بالنصوص والفوتوشوب الذكي، إلى إنشاء القصص وإصلاح الصور، يمكنك الوصول إلى مجموعة هائلة من الأدوات الإبداعية والتحريرية في مكان واحد.'
  },
  {
    icon: Gift,
    title: 'مجاني وغير محدود بالكامل',
    description: 'أطلق العنان لإبداعك بلا حدود. جميع أدواتنا مجانية 100% مع استخدام غير محدود، وبدون أي تكاليف خفية أو فئات مدفوعة.'
  },
  {
    icon: Rocket,
    title: 'وصول فوري، بدون تسجيل',
    description: 'ابدأ في الإبداع فورًا. لا حاجة للتسجيل، أو تسجيل الدخول، أو بطاقات ائتمان. فقط قوة ذكاء اصطناعي خالصة ومتاحة للجميع.'
  },
  {
    icon: Shield,
    title: 'الخصوصية أولاً',
    description: 'نحن نحترم خصوصيتك. يتم معالجة الصور التي ترفعها والمحتوى الذي تنشئه بشكل آمن، ويتم حذفه تلقائيًا من خوادمنا.'
  },
  {
    icon: Sparkles,
    title: 'نتائج عالية الجودة',
    description: 'مدعومة بنماذج ذكاء اصطناعي توليدية متقدمة لضمان أن إبداعاتك، من الصور الفنية إلى الصور المرممة، تتميز بالجودة العالية والتفاصيل الدقيقة.'
  },
  {
    icon: MousePointerClick,
    title: 'بسيط وسهل الاستخدام',
    description: 'لا توجد إعدادات معقدة أو صعوبة في التعلم. تم تصميم كل أداة لتكون مباشرة: ارفع ملفك أو اكتب نصك، انقر، وقم بالتحميل.'
  },
  {
    icon: Languages, // الميزة الجديدة والمهمة
    title: 'دعم كامل للغة العربية',
    description: 'نحن نفخر بتقديم واجهات وأدوات تدعم اللغة العربية بشكل كامل، مع فهم عميق للسياق لتقديم أفضل النتائج للمستخدم العربي.'
  },
  {
    icon: Users,
    title: 'لكل مبدع',
    description: 'سواء كنت كاتبًا، فنانًا، مصممًا، مسوقًا، أو تستمتع بوقتك فقط، فإن أدواتنا مصممة لإلهام ومساعدة الجميع.'
  }
];

export default function FeaturesAr() {
  return (
    <section id="features-ar" className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-purple-200">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">لماذا تختار AIConvert</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            مجموعة أدوات ذكاء اصطناعي مجانية{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              للجميع
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            لقد صممنا مجموعة من أدوات الذكاء الاصطناعي القوية وسهلة الاستخدام، وهي مجانية ومتاحة للجميع بشكل كامل.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-1"
            >
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg group-hover:shadow-xl transition-shadow">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/20 shadow-xl">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
              يثق بها المبدعون في كل مكان
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  موثوقة
                </div>
                <div className="text-gray-600">دائمًا</div>
              </div>
              
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  سريعة
                </div>
                <div className="text-gray-600">المعالجة</div>
              </div>
              
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  وصول
                </div>
                <div className="text-gray-600">عالمي</div>
              </div>
              
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  مُحبوبة من
                </div>
                <div className="text-gray-600">المستخدمين</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
