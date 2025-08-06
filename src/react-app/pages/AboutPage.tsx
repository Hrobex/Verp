// الملف: AboutPage.tsx
import { Gift, Rocket, Sparkles, MousePointerClick } from 'lucide-react';
import { Link } from 'react-router-dom';

// Define principles to easily manage them
const principles = [
  {
    icon: Gift,
    title: '100% Free, For Everyone',
    description: 'We believe in open access to creativity. Our tools have no hidden costs, premium tiers, or usage limits.'
  },
  {
    icon: Rocket,
    title: 'Instant & Anonymous',
    description: 'Your privacy comes first. Use our tools instantly without the need to sign up, log in, or share personal data.'
  },
  {
    icon: MousePointerClick,
    title: 'Radical Simplicity',
    description: 'We design every tool to be incredibly easy to use. No complex settings, just straightforward results.'
  },
  {
    icon: Sparkles,
    title: 'Powerful AI Quality',
    description: 'We rely on powerful, state-of-the-art AI models to deliver high-quality, reliable, and useful results for all your projects.'
  }
];

export default function AboutPage() {
  return (
    <>
      <title>About Us - AIConvert</title>
      <meta name="description" content="Learn about the mission and principles behind AIConvert. We are dedicated to providing free, accessible, and powerful AI tools for everyone." />
      <link rel="canonical" href="https://aiconvert.online/about" />  
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/about" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/about" />
      
      <div className="bg-gray-900 text-gray-300 pt-32 pb-20">
        <main className="max-w-4xl mx-auto px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              About AIConvert
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Democratizing creativity with powerful, free AI tools.
            </p>
          </div>

          <div className="space-y-16 text-lg leading-relaxed">
            
            {/* Our Story Section */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-cyan-500/30 pb-3">Our Story</h2>
              <div className="space-y-4">
                <p>In a world where artificial intelligence is rapidly advancing, we noticed a growing gap. The most powerful creative tools were often locked behind expensive subscriptions, complex interfaces, or data-hungry sign-up forms.</p>
                <p>Driven by this idea, <strong>we launched AIConvert in 2023</strong> with a simple, yet powerful belief: the power of AI creativity should be accessible to everyone, without barriers. ...</p>
              </div>
            </section>

            {/* Our Mission Section */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-cyan-500/30 pb-3">Our Mission</h2>
              <blockquote ...> Our mission is to <strong>democratize creativity</strong> by providing a comprehensive suite of high-quality AI tools, <strong>completely free, for everyone, forever.</strong></blockquote>
            </section>
            
            {/* Our Principles Section */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-8 border-b-2 border-cyan-500/30 pb-3">Our Core Principles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {principles.map((principle) => (
                  <div key={principle.title} className="bg-gray-800/50 p-6 rounded-xl flex items-start space-x-4">
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
            
            {/* Call to Action Section */}
            <section className="text-center mt-24">
              <h2 className="text-3xl font-bold text-white">Ready to Create?</h2>
              <p className="text-xl text-gray-400 mt-4 mb-8 max-w-2xl mx-auto">
                All of our tools are waiting for you. Dive in and see what you can create today.
              </p>
      
              <Link 
                to="/#tools" 
                className="inline-block bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg py-4 px-10 rounded-lg hover:shadow-xl hover:shadow-cyan-500/20 transform hover:-translate-y-1 transition-all duration-300"
              >
                Explore Our Free AI Tools
              </Link>
            </section>

          </div>
        </main>
      </div>
    </>
  );
}
