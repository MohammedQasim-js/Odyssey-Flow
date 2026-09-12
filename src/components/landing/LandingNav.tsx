import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, ShieldCheck, HeartPulse } from 'lucide-react';

interface LandingNavProps {
  onOpenPrototype: () => void;
  onOpenPatient: () => void;
  onOpenClinic: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  onOpenPrototype,
  onOpenPatient,
  onOpenClinic,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs'
          : 'bg-[#FAF9F6] border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Wordmark */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3 text-left group focus:outline-none cursor-pointer"
          >
            {/* Distinctive Geometric Logo Emblem */}
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-black tracking-tighter text-base shadow-xs group-hover:bg-[#16A34A] transition-colors">
              <span className="text-[#22C55E] group-hover:text-white transition-colors">O</span>
              <span className="text-white text-xs -ml-0.5">F</span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-stone-900 block leading-none">
                Odyssey<span className="text-[#16A34A]">Flow</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-stone-400 uppercase block mt-0.5">
                Clinical Operations &amp; Journey
              </span>
            </div>
          </button>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-[13px] font-medium text-stone-600">
            <button
              onClick={() => scrollToSection('product-overview')}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              Product
            </button>
            <button
              onClick={() => scrollToSection('two-journeys')}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('sanctuary-pulse')}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              Sanctuary Pulse
            </button>
            <button
              onClick={() => scrollToSection('diagnostic-journey')}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              Diagnostic Journey
            </button>
            <button
              onClick={() => scrollToSection('split-experience')}
              className="hover:text-stone-950 transition-colors cursor-pointer"
            >
              For Clinics &amp; Patients
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={onOpenPatient}
              className="text-xs font-semibold text-stone-600 hover:text-stone-950 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={onOpenPrototype}
              className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white text-xs font-bold tracking-tight shadow-sm transition-all flex items-center space-x-2 group cursor-pointer"
            >
              <span>Open Prototype</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#22C55E] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={onOpenPrototype}
              className="px-3.5 py-1.5 rounded-full bg-stone-900 text-white text-xs font-bold"
            >
              Prototype
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAF9F6] border-b border-stone-200 px-6 pt-2 pb-6 space-y-3">
          <button
            onClick={() => scrollToSection('product-overview')}
            className="block w-full text-left py-2 text-sm font-medium text-stone-700"
          >
            Product
          </button>
          <button
            onClick={() => scrollToSection('two-journeys')}
            className="block w-full text-left py-2 text-sm font-medium text-stone-700"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('sanctuary-pulse')}
            className="block w-full text-left py-2 text-sm font-medium text-stone-700"
          >
            Sanctuary Pulse
          </button>
          <button
            onClick={() => scrollToSection('diagnostic-journey')}
            className="block w-full text-left py-2 text-sm font-medium text-stone-700"
          >
            Diagnostic Journey
          </button>
          <button
            onClick={() => scrollToSection('split-experience')}
            className="block w-full text-left py-2 text-sm font-medium text-stone-700"
          >
            For Clinics &amp; Patients
          </button>
          
          <div className="pt-3 border-t border-stone-200 flex flex-col space-y-2">
            <button
              onClick={onOpenPatient}
              className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-800 text-xs font-bold text-center"
            >
              Sign In (Patient App)
            </button>
            <button
              onClick={onOpenClinic}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold text-center flex items-center justify-center space-x-2"
            >
              <span>Open Clinic Console</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#22C55E]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
