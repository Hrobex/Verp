// الملف: src/react-app/components/Features.tsx
import { 
  Shield, 
  Rocket, 
  Sparkles, 
  Layers,
  Gift,
  MousePointerClick,
  Smartphone,
  Users
} from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Diverse AI Toolkit',
    description: 'From text-to-image generation and AI photoshop to story creation and photo repair, access a massive range of creative and editing tools in one place.'
  },
  {
    icon: Gift,
    title: 'Completely Free & Unlimited',
    description: 'Unleash your creativity without limits. All our tools are 100% free with unlimited usage, no hidden costs or premium tiers.'
  },
  {
    icon: Rocket,
    title: 'Instant Access, No Sign-Up',
    description: 'Start creating immediately. No sign-ups, no logins, no credit cards required. Just pure, accessible AI power.'
  },
  {
    icon: Shield,
    title: 'Privacy-Focused by Design',
    description: 'We respect your privacy. Your uploaded images and generated content are processed securely and automatically deleted from our servers.'
  },
  {
    icon: Sparkles,
    title: 'High-Quality Results',
    description: 'Powered by advanced generative AI models to ensure your creations, from artistic images to repaired photos, are high-quality and detailed.'
  },
  {
    icon: MousePointerClick,
    title: 'Simple & Intuitive',
    description: 'No complex settings or learning curves. Every tool is designed to be straightforward: upload your file or type your text, click, and download.'
  },
  {
    icon: Smartphone,
    title: 'Works On Any Device',
    description: 'Access our full suite of AI tools from your desktop, tablet, or mobile. All you need is a modern web browser to start creating.'
  },
  {
    icon: Users,
    title: 'For Every Creator',
    description: 'Whether you\'re a writer, artist, designer, marketer, or just having fun, our tools are built to inspire and assist everyone.'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-purple-200">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Why Choose AIConvert</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            A Free AI Toolkit for{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Everyone
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've designed a suite of powerful and easy-to-use AI tools that are completely free and accessible to all.
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
              Trusted by Creators Worldwide
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Reliable
                </div>
                <div className="text-gray-600">Service</div>
              </div>
              
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Fast
                </div>
                <div className="text-gray-600">Processing</div>
              </div>
              
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Global
                </div>
                <div className="text-gray-600">Access</div>
              </div>
              
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Loved by
                </div>
                <div className="text-gray-600">Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
