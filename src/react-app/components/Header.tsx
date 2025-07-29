import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Convert
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="#tools" className="text-gray-700 hover:text-purple-600 transition-colors">
            AI Tools
          </a>
          <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
            Features
          </a>
          <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">
            About
          </a>
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center space-x-4">
          <button className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Get Started Free
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-6 py-4 space-y-4">
            <a href="#tools" className="block text-gray-700 hover:text-purple-600 transition-colors">
              AI Tools
            </a>
            <a href="#features" className="block text-gray-700 hover:text-purple-600 transition-colors">
              Features
            </a>
            <a href="#about" className="block text-gray-700 hover:text-purple-600 transition-colors">
              About
            </a>
            <button className="w-full px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
              Get Started Free
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
