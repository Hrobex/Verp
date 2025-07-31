// src/react-app/components/FeaturesArabic.tsx

import { 
  Shield, 
  Zap, 
  Globe, 
  Download,
  Clock,
  Users,
  Smartphone,
  Award
} from 'lucide-react';

const featuresArabic = [
  {
    icon: Zap,
    title: 'معالجة فائقة السرعة',
    description: 'نماذجنا المتقدمة للذكاء الاصطناعي تعالج طلباتك في ثوانٍ، وليس دقائق. اختبر سرعة الجيل القادم من الذكاء الاصطناعي.'
  },
  {
    icon: Shield,
    title: 'أمان على مستوى الشركات',
    description: 'بياناتك محمية بتشفير عسكري. لا نقوم أبدًا بتخزين محتواك الشخصي بعد انتهاء المعالجة.'
  },
  {
    icon: Globe,
    title: 'شبكة توصيل عالمية (CDN)',
    description: 'صل إلى أدواتنا من أي مكان في العالم بزمن وصول منخفض بفضل بنيتنا التحتية الموزعة.'
  },
  {
    icon: Download,
    title: 'تنسيقات تصدير متعددة',
    description: 'نزّل إبداعاتك بأي تنسيق تحتاجه - PNG، JPG، MP3، WAV، والمزيد من التنسيقات الاحترافية.'
  },
  {
    icon: Clock,
    title: 'توفر على مدار الساعة',
    description: 'ذكاؤنا الاصطناعي لا ينام. أنشئ وعدّل وحسّن محتواك كلما جاءك الإلهام، ليلًا أو نهارًا.'
  },
  {
    icon: Users,
    title: 'تعاون الفرق',
    description: 'شارك المشاريع مع فريقك، وأدر مساحات العمل، وتعاون بسلاسة على المشاريع الإبداعية.'
  },
  {
    icon: Smartphone,
    title: 'وصول عبر جميع المنصات',
    description: 'استخدم AI Convert على أي جهاز - سطح المكتب، الجهاز اللوحي، أو الجوال. تتم مزامنة عملك تلقائيًا عبر جميع المنصات.'
  },
  {
    icon: Award,
    title: 'جودة احترافية',
    description: 'أنشئ محتوى يفي بالمعايير الاحترافية. مثالي للشركات والوكالات والمبدعين المحترفين.'
  }
];

export default function FeaturesArabic() {
  return (
    <section id="features" dir="rtl" className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-reverse space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-purple-200">
            <Award className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">لماذا تختار AI Convert</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            صُمم لـ{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              المبدعين العصريين
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            لقد صممنا كل جانب من جوانب AI Convert لتقديم أفضل تجربة ممكنة 
            للمبدعين الذين يطلبون الجودة والسرعة والموثوقية.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresArabic.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-1 text-right"
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg group-hover:shadow-xl transition-shadow">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/20 shadow-xl">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
              يثق به المبدعون حول العالم
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  99.9%
                </div>
                <div className="text-gray-600">اتفاقية مستوى الخدمة</div>
              </div>
              
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  2.5s
                </div>
                <div className="text-gray-600">متوسط المعالجة</div>
              </div>
              
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  150+
                </div>
                <div className="text-gray-600">دولة</div>
              </div>
              
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  4.9★
                </div>
                <div className="text-gray-600">تقييم المستخدمين</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
