// src/react-app/components/AIToolsArabic.tsx

import {
  Image, Scissors, Volume2, Sparkles, ArrowLeft, MessageSquare, Zap, Wand, Wand2,
  Pencil, Palette, SprayCan, Drama, Smile, Film, Paintbrush
} from 'lucide-react';
import { Link } from 'react-router-dom';
import VercelImage from './VercelImage';

const toolsArabic = [
  {
    id: 'artigenv2',
    title: 'Artigen V2: مولد الفن بالذكاء الاصطناعي',
    description: 'فنان ذكاء اصطناعي يحول نصوصك إلى أعمال فنية فريدة وعالية الجودة بلمسة جمالية مميزة.',
    icon: Palette,
    color: 'from-yellow-500 to-orange-600',
    features: ['أسلوب فني مميز', 'نتائج فائقة الجودة', 'مجاني بالكامل'],
    image: '/images/artigenv2-ai-image-generator.webp',
    alt: 'صورة ترويجية لأداة ArtigenV2 لتوليد الصور مع خلفية فنية باللونين الأصفر والبرتقالي.'
  },
  {
    id: 'generate-image-pro',
    title: 'توليد الصور بالذكاء الاصطناعي',
    description: 'أنشئ صورًا مذهلة وعالية الجودة من أوصاف نصية بسيطة باستخدام نماذج الذكاء الاصطناعي المتقدمة لدينا.',
    icon: Image,
    color: 'from-purple-500 to-purple-600',
    features: ['أنماط متعددة', 'دقة عالية', 'استخدام تجاري'],
    image: '/images/artigen-pro-ai-image-creator.webp',
    alt: 'صورة مميزة لأداة Artigen Pro مع خلفية لسديم كوني يرمز لقدرات الذكاء الاصطناعي.'
  },
  {
    id: 'anime-ai',
    title: 'مولد صور الأنمي',
    description: 'أنشئ شخصيات ورسومات أنمي أصلية بأنماط متنوعة مثل الحديث، التسعينات، تشيبي، وغيرها.',
    icon: SprayCan,
    color: 'from-pink-500 to-orange-600',
    features: ['أنماط متنوعة', 'شخصيات أصلية', 'مجاني وبلا حدود'],
    image: '/images/ai-anime-generation.jpg',
    alt: 'مجموعة من شخصيات ورسومات الأنمي التي تم إنشاؤها بواسطة الذكاء الاصطناعي.'
  },
  {
    id: 'line-drawing',
    title: 'LineArtify: تحويل الصور إلى رسم رصاص',
    description: 'حوّل صورك إلى فن خطي أنيق ونظيف باستخدام محول الرسم المدعوم بالذكاء الاصطناعي.',
    icon: Pencil,
    color: 'from-cyan-500 to-blue-600',
    features: ['تحويل فوري', 'رسم عالي الجودة', 'للفنانين والمبدعين'],
    image: '/images/image-to-line-drawing-ai.webp',
    alt: 'صورة توضيحية لخدمة تحويل الصور إلى رسومات خطية، تعرض صورة قبل وبعد التحويل.'
  },
  {
    id: 'ai-video-prompt-generator',
    title: 'مولد وصف الفيديو بالذكاء الاصطناعي',
    description: 'حوّل أي صورة ثابتة إلى وصف فيديو سينمائي. يكتب الذكاء الاصطناعي أوامر احترافية لمنصات مثل Sora و Veo و Runway.',
    icon: Film,
    color: 'from-rose-500 to-teal-600',
    features: ['أوصاف سينمائية', 'لمنصات Sora و Veo وغيرها', 'مجاني وبدون تسجيل'],
    image: '/images/ai-video-prompt-generation.jpg',
    alt: 'تصميم ثلاثي الأبعاد لكلمات "مولد وصف الفيديو بالذكاء الاصطناعي" بأسلوب سينمائي.'
  },
  {
    id: "prompt-generator",
    title: "Promptigen: تحويل الصورة إلى وصف نصي",
    description: "حوّل أي صورة إلى وصف نصي احترافي لاستخدامه في مولدات الصور بالذكاء الاصطناعي مثل ميدجورني.",
    icon: Pencil,
    color: "from-sky-500 to-violet-600",
    features: ["هندسة عكسية للصور", "أوصاف نصية احترافية", "مجاني وغير محدود"],
    image: "/images/promptigen-image-to-prompt.webp",
    alt: "صورة لأداة Promptigen التي تقوم بتحويل الصور إلى أوامر نصية لاستخدامها في مولدات الفن."
  },
  {
    id: 'remove-background',
    title: 'إزالة الخلفية',
    description: 'أزل الخلفيات من أي صورة على الفور بدقة فائقة بفضل الذكاء الاصطناعي الذي يتعامل مع الحواف المعقدة بشكل مثالي.',
    icon: Scissors,
    color: 'from-blue-500 to-blue-600',
    features: ['معالجة فورية', 'كشف الحواف', 'معالجة جماعية'],
    image: '/images/remove-images-background.webp',
    alt: 'مثال يوضح دقة أداة إزالة الخلفية، يعرض صورة قبل وبعد إزالة الخلفية.'
  },
  {
    id: 'text-to-speech',
    title: 'تحويل النص إلى صوت',
    description: 'حوّل أي نص إلى كلام طبيعي مع توفر العديد من الأصوات واللغات.',
    icon: Volume2,
    color: 'from-green-500 to-green-600',
    features: ['أصوات طبيعية', 'أكثر من 50 لغة', 'سرعة مخصصة'],
    image: '/images/free-ai-text-to-speech.jpg',
    alt: 'صورة مميزة لخدمة تحويل النص إلى كلام مع خلفية رقمية تكنولوجية.'
  },
  {
    id: 'ai-face-merge',
    title: 'Mergify: تبديل ودمج الوجوه',
    description: 'بدّل الوجوه في أي صورة بواقعية مدهشة. أنشئ صورًا مرحة ومبتكرة عبر دمج الوجوه فورًا باستخدام أداتنا المتقدمة.',
    icon: Drama,
    color: 'from-purple-500 to-fuchsia-600',
    features: ['دمج واقعي بالذكاء الاصطناعي', 'دعم الصور الجماعية', 'خصوصية وأمان'],
    image: '/images/mergify-face-swap.jpg',
    alt: 'عرض لتقنية دمج وتبديل الوجوه، يظهر كيف يمكن دمج وجه في صور فنية مختلفة.'
  },
  {
    id: 'llama-4',
    title: 'Llama-4: شات الذكاء الاصطناعي المتقدم',
    description: 'خض محادثات ذكية مع مساعد الذكاء الاصطناعي من الجيل الجديد. يتميز بذاكرة سياق واسعة، سجل للمحادثات، وقدرات استدلال متقدمة.',
    icon: MessageSquare,
    color: 'from-emerald-500 to-amber-600',
    features: ['ذاكرة سياق واسعة', 'سرعة رد فائقة', 'تصدير المحادثة'],
    image: '/images/free-llama-4-ai-chatbot.jpg',
    alt: 'عنوان "Llama 4: Free Unlimited" مكتوب بخط كروم ثلاثي الأبعاد وبارز، يطفو أمام انفجار ديناميكي ومستقبلي من الضوء والجسيمات.'
  },
  {
    id: 'cartoonify',
    title: 'حوّل صورتك إلى كرتون',
    description: 'حوّل صورتك فورًا إلى كرتون ممتع بأسلوب ثنائي الأبعاد بنقرة واحدة. مثالية لصور البروفايل ووسائل التواصل الاجتماعي!',
    icon: Smile,
    color: 'from-rose-400 to-purple-600',
    features: ['تحويل فوري', 'أسلوب كرتوني كلاسيكي', 'مجاني وبسيط'],
    image: '/images/cartoonify-yourself.webp',
    alt: 'صورة توضيحية لامرأة قبل وبعد تحويل صورتها إلى كرتون بأسلوب فني.'
  },
  {
    id: 'cartoony-art',
    title: 'DigiCartoony: تحويل الصور لفن رقمي',
    description: 'ارتقِ بصورك إلى مستوى اللوحات الرقمية عالية الجودة بأسلوب فني فريد وتفاصيل دقيقة.',
    icon: Paintbrush,
    color: 'from-teal-500 to-cyan-600',
    features: ['أسلوب الرسم الرقمي', 'تحديد الوجه', 'فن عالي الجودة'],
    image: '/images/digicartoony-digital-art.webp',
    alt: 'مثال يوضح تحويل صورة رجل إلى لوحة فنية رقمية باستخدام أداة DigiCartoony.'
  },
  {
    id: "ai-story-generator",
    "title": "Storygen: مولد القصص بالذكاء الاصطناعي",
    "description": "أطلق العنان لإبداعك. حوّل أي صورة إلى قصة فريدة قائمة على السرد باستخدام الذكاء الاصطناعي المتطور.",
    "icon": Pencil,
    "color": "from-indigo-500 to-violet-600",
    "features": ["سرد قصصي عميق", "كاتب متعدد اللغات", "إلهام فوري"],
    image: "/images/ai-image-to-story-generator.jpg",
    alt: "صورة رمزية لمولد القصص، تظهر كتابًا مفتوحًا تنبثق منه قصة خيالية."
  },
  {
    id: 'ai-photo-colorizer',
    title: 'ColorifyPro: تلوين الصور القديمة',
    description: 'أضف ألوانًا واقعية تلقائيًا إلى صورك بالأبيض والأسود، وأعد إحياء ذكرياتك القديمة من جديد.',
    icon: Image,
    color: 'from-red-500 to-green-600',
    features: ['تلوين الصور القديمة', 'ألوان طبيعية واقعية', 'إحياء الذكريات'],
    image: '/images/ai-photo-colorizer-before-after.webp',
    alt: 'مثال يوضح نتيجة أداة تلوين الصور بالذكاء الاصطناعي، يعرض مقارنة بين صورة قديمة بالأبيض والأسود بعد تحويلها إلى صورة ملونة بالكامل.'
  },
  {
    id: 'ai-image-enhancer',
    title: 'تحسين جودة الصور',
    description: 'قم بترقية وتحسين صورك باستخدام الذكاء الاصطناعي. زد الدقة مع الحفاظ على الجودة.',
    icon: Sparkles,
    color: 'from-orange-500 to-orange-600',
    features: ['تكبير 4x', 'تقليل الضوضاء', 'تحسين الجودة'],
    image: '/images/ai-image-enhancement.webp',
    alt: 'صورة "قبل وبعد" توضح تحسين جودة صورة وجه باستخدام الذكاء الاصطناعي.'
  },
  {
    id: 'restore-and-repair-old-photos',
    title: 'ترميم وإصلاح الصور القديمة',
    description: 'أعد الحياة لذكرياتك. أداتنا الذكية تصلح الصور القديمة والتالفة، تزيل الخدوش، وتحسن الجودة تلقائيًا.',
    icon: Wand,
    color: 'from-amber-500 to-cyan-600',
    features: ['إزالة الخدوش', 'تحسين الجودة', 'مجاني وآمن'],
    image: '/images/photorevive-ai-photo-restoration.webp',
    alt: 'مثال يوضح ترميم صورة قديمة وتالفة وإعادتها لحالتها الأصلية.'
  }
];

export default function AIToolsArabic() {
  return (
    <section id="tools" dir="rtl" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-reverse space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-2 mb-6">
            <Wand2 className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">أدوات مدعومة بالذكاء الاصطناعي</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            كل ما تحتاجه لـ{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              إنشاء محتوى مذهل
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            مجموعتنا الشاملة من أدوات الذكاء الاصطناعي تمكّن المبدعين والمصممين والشركات
            من إنتاج محتوى احترافي في ثوانٍ.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {toolsArabic.map((tool) => (
            <div
              key={tool.id}
              className="group relative bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden hover:shadow-2xl"
            >
              <div className="relative h-48 lg:h-56 overflow-hidden">
                <VercelImage
                  src={tool.image}
                  alt={tool.alt}
                  sizes="(max-width: 1023px) calc(100vw - 3rem), 583px"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className={`absolute top-4 right-4 p-3 rounded-xl bg-gradient-to-r ${tool.color} shadow-lg`}>
                  <tool.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="p-8 text-right">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {tool.description}
                </p>
                <div className="flex flex-wrap justify-end gap-2 mb-6">
                  {tool.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <Link to={`/ar/${tool.id}`} className="group/btn inline-flex items-center space-x-reverse space-x-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                  <span>{`جرّب ${tool.title}`}</span>
                  <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <button className="group inline-flex items-center space-x-reverse space-x-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
            <Zap className="h-5 w-5" />
            <span>الوصول إلى كل الأدوات الآن</span>
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
            }
