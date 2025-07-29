import Header from '@/react-app/components/Header';
import Hero from '@/react-app/components/Hero';
import AITools from '@/react-app/components/AITools';
import Features from '@/react-app/components/Features';
import Footer from '@/react-app/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <AITools />
      <Features />
      <Footer />
    </div>
  );
}
