import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { 
  Home, 
  Users, 
  BookOpen, 
  MessageCircle, 
  Sparkles,
  Menu,
  X,
  Heart,
  GraduationCap
} from 'lucide-react';

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', page: 'Home', icon: Home },
    { name: 'Our Seniors', page: 'Seniors', icon: Users },
    { name: 'Stories', page: 'Stories', icon: BookOpen },
    { name: 'Interview', page: 'Interview', icon: MessageCircle },
    { name: 'Prompt Cards', page: 'PromptCards', icon: Sparkles },
    { name: 'Training', page: 'Training', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#E8DFD5] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to={createPageUrl('Home')} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C4785A] to-[#E8A98A] flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-serif text-xl text-[#3D3D3D] hidden sm:block">StoryBridge</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.page)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[#6B6B6B] hover:bg-[#F5EDE6] hover:text-[#C4785A] transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#6B6B6B] hover:bg-[#F5EDE6]"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#E8DFD5] py-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-[#6B6B6B] hover:bg-[#FDF8F3]"
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E8DFD5] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#6B6B6B] text-sm">
            Preserving precious memories, one story at a time
          </p>
          <p className="text-[#B8B0A8] text-xs mt-2">
            🌱 1% of profits donated to reforestation
          </p>
        </div>
      </footer>
    </div>
  );
}