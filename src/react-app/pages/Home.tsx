import Hero from '@/react-app/components/Hero';
import AITools from '@/react-app/components/AITools';
import Features from '@/react-app/components/Features';

export default function Home() {
  return (
    
    <div className="min-h-screen bg-white pt-24">
      <Hero />
      <AITools />
      <Features />
    </div>
  );
}
