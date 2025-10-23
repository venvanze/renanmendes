import React from "react";
import type { TestimonialsData } from "../../types/content";

const logoAssets = import.meta.glob<string>("../../assets/*.{png,svg}", {
  eager: true,
  import: "default",
});

interface LogoConfig {
  name: string;
  file: string;
}

interface TestimonialsSectionProps { testimonialsData: TestimonialsData }

export function TestimonialsSection({ testimonialsData }: TestimonialsSectionProps) {
  if (!testimonialsData) return null;

  const LOGOS: LogoConfig[] = [
    { name: 'Natura', file: 'natura.svg' },
    { name: 'Mercado Livre', file: 'mercado-livre.svg' },
    { name: 'Bioeconomy Amazon Sunset', file: 'bioeconomy-amazon-sunset.png' },
    { name: 'O Boticário', file: 'o-boticario.svg' },
    { name: 'Psica Festival', file: 'psica.png' },
    { name: 'Festival Vivo Sunset', file: 'festival-vivo-sunset.png' },
    { name: 'CESUPA', file: 'cesupa.png' },
    { name: 'Companhia Docas do Pará', file: 'companhia-docas-para.png' },
    { name: 'Johnnie Walker', file: 'johnnie-walker.svg' },
    { name: 'MOR', file: 'mor.png' },
    { name: 'Kuro Neko', file: 'kuro-neko.png' },
    { name: 'Amazon Deli', file: 'amazon-deli.png' },
    { name: 'Famiglia da Pizza', file: 'famiglia-da-pizza.png' },
    { name: 'Festival Co-League', file: 'festival-co-league.png' },
    { name: 'Festival Claro que é Rock', file: 'festival-claro-rock.png' },
  ];

  const logosWithAssets = LOGOS.reduce<Array<LogoConfig & { src: string }>>((acc, logo) => {
    const assetPath = `../../assets/${logo.file}`;
    const src = logoAssets[assetPath];

    if (src) {
      acc.push({ ...logo, src });
    }

    return acc;
  }, []);

  return (
    <section id="clientes" aria-label="Clientes" className="scroll-offset bg-[#080f17] px-4 md:px-8 lg:px-[190px] py-12 relative overflow-hidden">
      <div className="pt-12 mb-12 text-center">
        <h2 className="font-[Plus_Jakarta_Sans] font-bold text-[#d6dde6] text-xl sm:text-2xl lg:text-[28px] leading-[52px] tracking-[-0.28px]">
          Clientes satisfeitos
        </h2>
      </div>
      <div role="region" aria-label="Logos de clientes">
        <div className="flex flex-wrap gap-8 md:gap-10 px-6 items-center justify-center">
          {logosWithAssets.map((logo) => (
            <div key={logo.name} className="shrink-0 flex items-center justify-center">
              <img
                src={logo.src}
                alt={logo.name}
                className="w-auto object-contain"
                style={{ maxHeight: '200px' }}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.style.display = 'none';
                  // No text fallback; leave empty to avoid showing brand names.
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
