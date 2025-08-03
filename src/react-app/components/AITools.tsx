// src/react-app/components/AITools.tsx

import { 
  Image, 
  Scissors, 
  Volume2, 
  Sparkles, 
  ArrowRight,
  Zap,
  Wand2,
  Pencil,
  Palette,
  SprayCan,
  Drama, 
  Smile,
  Paintbrush
  
} from 'lucide-react';
import { Link } from 'react-router-dom';

const tools = [
    {
    id: 'artigenv2',
    title: 'Artigen V2: AI Art Generator',
    description: 'An AI artist that transforms your text into unique, high-quality artwork with a distinct aesthetic.',
    icon: Palette, 
    color: 'from-yellow-500 to-orange-600',
    features: ['Distinct Artistic Style', 'High-Quality Results', 'Completely Free'],
    image: 'https://images.unsplash.com/photo-1620421680280-d02b54174780?w=400&h=300&fit=crop'
  },
  {
    id: 'generate-image-pro',
    title: 'Artigen Pro: AI Image Generation',
    description: 'Create stunning, high-quality images from simple text descriptions using our advanced AI models.',
    icon: Image,
    color: 'from-purple-500 to-purple-600',
    features: ['Multiple styles', 'High resolution', 'Commercial use'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop'
  },
    {
    id: 'anime-ai',
    title: 'AI Anime Generator',
    description: 'Create original anime characters and illustrations in various styles like Modern, 90s Retro, Chibi, and more.',
    icon: SprayCan,
    color: 'from-pink-500 to-orange-600',
    features: ['Multiple Styles', 'OC Creation', 'Free & Unlimited'],
    image: 'https://images.unsplash.com/photo-1613376023733-0a752709423d?w=400&h=300&fit=crop'
  },
  {
    id: 'line-drawing',
    title: 'LineArtify: Photo to Line Drawing',
    description: 'Transform your photos into elegant, clean line art with our AI-powered sketch converter.',
    icon: Pencil,
    color: 'from-cyan-500 to-blue-600',
    features: ['Instant conversion', 'High-quality sketch', 'For artists & creators'],
    image: 'https://images.unsplash.com/photo-1569336415962-a4294509e385?w=400&h=300&fit=crop'
  },
  {
    id: 'remove-background',
    title: 'Background Removal',
    description: 'Remove backgrounds from any image instantly with precision AI that handles complex edges perfectly.',
    icon: Scissors,
    color: 'from-blue-500 to-blue-600',
    features: ['Instant processing', 'Edge detection', 'Custom Backgrounds'],
    image: 'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=400&h=300&fit=crop'
  },
  {
    id: 'text-to-speech',
    title: 'Text to Audio',
    description: 'Convert any text into natural-sounding speech with multiple voices and languages available.',
    icon: Volume2,
    color: 'from-green-500 to-green-600',
    features: ['Natural voices', '138+ languages', 'Custom speed'],
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop'
  },
  {
  id: 'ai-face-merge',
  title: 'Mergify: AI Face Swap',
  description: 'Swap faces in any photo with surprising realism. Create fun and creative images by merging faces instantly with our advanced AI face swapper.',
  icon: Drama, 
  color: 'from-purple-500 to-fuchsia-600',
  features: ['Realistic AI Swaps', 'Group Photo Support', 'Privacy Focused'],
  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop' // صورة مقترحة، يمكن تغييرها
  },
  {
    id: 'cartoonify',
    title: 'Cartoonify Yourself',
    description: 'Instantly turn your photo into a fun, 2D-style cartoon with a single click. Perfect for profile pictures and social media!',
    icon: Smile, 
    color: 'from-rose-400 to-purple-600',
    features: ['Instant Conversion', 'Classic 2D Style', 'Free & Simple'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop'
  },
  {
    id: 'cartoony-art',
    title: 'DigiCartoony: Photo to Digital Art',
    description: 'Elevate your photos into high-quality digital paintings with a unique, artistic style and detailed rendering.',
    icon: Paintbrush, 
    color: 'from-teal-500 to-cyan-600',
    features: ['Digital Painting Style', 'Face Detection', 'High-Quality Art'],
    image: 'https://images.unsplash.com/photo-1582573514932-349103231f16?w=400&h=300&fit=crop'
  },
  {
    id: 'ai-image-enhancer',
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="group relative bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden hover:shadow-2xl"
            >
              <div className="relative h-48 lg:h-56 overflow-hidden">
                <img
                  src={tool.image}
                  alt={tool.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className={`absolute top-4 left-4 p-3 rounded-xl bg-gradient-to-r ${tool.color} shadow-lg`}>
                  <tool.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {tool.description}
                </p>
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
                {/* THIS IS THE ONLY LINE THAT WAS CHANGED, TO MAKE THE LINK ABSOLUTE */}
                <Link to={`/${tool.id}`} className="group/btn flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                  <span>Try {tool.title}</span>
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
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
