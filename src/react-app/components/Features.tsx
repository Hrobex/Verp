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

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Processing',
    description: 'Our advanced AI models process your requests in seconds, not minutes. Experience the speed of next-generation AI.'
  },
  {
    icon: Shield,
    title: 'Enterprise-Grade Security',
    description: 'Your data is protected with military-grade encryption. We never store your personal content beyond processing.'
  },
  {
    icon: Globe,
    title: 'Global CDN Network',
    description: 'Access our tools from anywhere in the world with low latency thanks to our distributed infrastructure.'
  },
  {
    icon: Download,
    title: 'Multiple Export Formats',
    description: 'Download your creations in any format you need - PNG, JPG, MP3, WAV, and more professional formats.'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Our AI never sleeps. Create, edit, and enhance your content whenever inspiration strikes, day or night.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share projects with your team, manage workspaces, and collaborate seamlessly on creative projects.'
  },
  {
    icon: Smartphone,
    title: 'Cross-Platform Access',
    description: 'Use Vape on any device - desktop, tablet, or mobile. Your work syncs automatically across all platforms.'
  },
  {
    icon: Award,
    title: 'Professional Quality',
    description: 'Generate content that meets professional standards. Perfect for businesses, agencies, and creative professionals.'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-purple-200">
            <Award className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Why Choose Vape</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Built for{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Modern Creators
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've designed every aspect of Vape to provide the best possible experience 
            for creators who demand quality, speed, and reliability.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-1"
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
              Trusted by creators worldwide
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  99.9%
                </div>
                <div className="text-gray-600">Uptime SLA</div>
              </div>
              
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  2.5s
                </div>
                <div className="text-gray-600">Avg. Processing</div>
              </div>
              
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  150+
                </div>
                <div className="text-gray-600">Countries</div>
              </div>
              
              <div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  4.9★
                </div>
                <div className="text-gray-600">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
