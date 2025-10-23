import React, { ReactElement } from "react";
import { useContent } from "./hooks/useContent";
import type { AppContent } from "./types/content";

// image loaded from public/assets to avoid needing a .d.ts for image imports
// import { Header } from "./components/sections/Header";
import { HeroSection } from "./components/sections/HeroSection";
import { HighlightsSection } from "./components/sections/HighlightsSection";
import { AboutSection } from "./components/sections/AboutSection";
import { TestimonialsSection } from "./components/sections/TestimonialsSection";
import { Footer } from "./components/sections/Footer";


export default function App(): ReactElement | null {
  const { content, loading, error, refreshContent } = useContent() as {
    content: AppContent | null;
    loading: boolean;
    error: string | null;
    refreshContent: () => void;
  };

  // Measure header height to keep hook order stable across renders
  const [headerHeight, setHeaderHeight] = React.useState(0);
  React.useEffect(() => {
    const measure = () => {
      const el = document.querySelector('header[role="banner"]') as HTMLElement | null;
      setHeaderHeight(el ? el.getBoundingClientRect().height : 0);
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-[#080f17] min-h-screen flex items-center justify-center">
        <div className="font-[Plus_Jakarta_Sans] font-medium text-[#d6dde6] text-lg" role="status" aria-live="polite">
          Carregando...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#080f17] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="font-[Plus_Jakarta_Sans] font-medium text-red-400 text-lg mb-4" role="alert">
            Erro ao carregar conteúdo: {error}
          </div>
          <button
            onClick={refreshContent}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-[Plus_Jakarta_Sans] font-medium transition-colors duration-200"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="bg-[#080f17] min-h-screen">
      {/* Refresh button (dev-only) removed as requested */}

      {/* Header + Hero */}
      <div
        className="relative min-h-[60vh] bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('/assets/bghero.png')` }}
      >
        {/* Fixed top header removed; nav lives in Hero bottom */}
        <HeroSection heroData={content.hero} headerData={content.header} headerOffset={headerHeight} />
        {/* Progress bar now rendered inside HeroSection */}
      </div>

      <div className="mx-auto w-full max-w-[1900px]">
        <main>
          <AboutSection aboutData={content.about} industriesData={content.industries} />
          <HighlightsSection highlightsData={content.highlights} />
          <TestimonialsSection testimonialsData={content.testimonials} />
        </main>

        <Footer footerData={content.footer} />
      </div>
    </div>
  );
}
