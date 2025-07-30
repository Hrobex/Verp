import { 
  Image, 
  Scissors, 
  Volume2, 
  Sparkles, 
  ArrowRight,
  Zap,
  Wand2,
  Pencil // <-- 1. تم استيراد أيقونة جديدة
} from 'lucide-react';
import { Link } from 'react-router-dom';

const tools = [
  {
    id: 'image-generator',
    title: 'AI Image Generation',
    description: 'Create stunning, high-quality images from simple text descriptions using our advanced AI models.',
    icon: Image,
    color: 'from-purple-500 to-purple-600',
    features: ['Multiple styles', 'High resolution', 'Commercial use'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop'
  },
  // --- START: NEW TOOL ADDED HERE ---
  {
    id: 'line-artify', // <-- 2. هذا هو المعرف المطابق للرابط
    title: 'LineArtify: Photo to Lina Art',
    description: 'Transform your photos into elegant, clean line art with our AI-powered Lina Art converter.',
    icon: Pencil, // <-- 3. استخدام الأيقونة الجديدة
    color: 'from-cyan-500 to-blue-600', // <-- 4. لون متناسق مع صفحة الأداة
    features: ['Instant conversion', 'High-quality sketch', 'For artists & creators'],
    image: 'https://images.unsplash.com/photo-1608447047976-50a1b6a71404?w=400&h=300&fit=crop'
  },
  // --- END: NEW TOOL ADDED HERE ---
  {
    id: 'background-removal',
    title: 'Background Removal',
    description: 'Remove backgrounds from any image instantly with precision AI that handles complex edges perfectly.',
    icon: Scissors,
    color: 'from-blue-500 to-blue-600',
    features: ['Instant processing', 'Edge detection', 'Bulk processing'],
    image: 'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=400&h=300&fit=crop'
  },
  {
    id: 'text-to-audio',
    title: 'Text to Audio',
    description: 'Convert any text into natural-sounding speech with multiple voices and languages available.',
    icon: Volume2,
    color: 'from-green-500 to-green-600',
    features: ['Natural voices', '50+ languages', 'Custom speed'],
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop'
  },
  {
    id: 'image-enhancement',
    title: 'Image Enhancement',
    description: 'Upscale and enhance your images with AI. Increase resolution while maintaining quality.',
    icon: Sparkles,
    color: 'from-orange-500 to-orange-600',
    features: ['4x upscaling', 'Noise reduction', 'Quality boost'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
  }
];

export default function AITools() {
  return (
    <section id="tools" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-2 mb-6">
            <Wand2 className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">AI-Powered Tools</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Create Amazing Content
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive suite of AI tools empowers creators, designers, and businesses 
            to produce professional-quality content in seconds.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="group relative bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden hover:shadow-2xl"
            >
              {/* Image */}
              <div className="relative h-48 lg:h-56 overflow-hidden">
                <img
                  src={tool.image}
                  alt={tool.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Icon */}
                <div className={`absolute top-4 left-4 p-3 rounded-xl bg-gradient-to-r ${tool.color} shadow-lg`}>
                  <tool.icon className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {tool.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {tool.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tool.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link to={`/tools/${tool.id}`} className="group/btn flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                  <span>Try {tool.title}</span>
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="group inline-flex items-center space-x-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
            <Zap className="h-5 w-5" />
            <span>Access All Tools Now</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
