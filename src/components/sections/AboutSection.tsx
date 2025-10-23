import React from "react";
import type { AboutData } from "../../types/content";
import { SplitText } from "../../utils/animation";

interface AboutSectionProps {
  aboutData: AboutData;
}

export function AboutSection({ aboutData }: AboutSectionProps) {
  if (!aboutData) return null;
  return (
    <section id="sobre" aria-label="Sobre" className="scroll-offset bg-[#080f17] px-4 md:px-8 lg:px-[190px] py-12 lg:py-36">
      <div className="space-y-6 lg:space-y-6">
        {/* Linha 1: Texto principal */}
        <div className="max-w-4xl">
          <p className="font-[Plus_Jakarta_Sans] font-bold text-[#d6dde6] text-lg sm:text-2xl lg:text-[46px] leading-relaxed lg:leading-[68px] tracking-tight lg:tracking-[-0.92px]">
            <SplitText text="Sou um editor de vídeo apaixonado com mais de uma década de experiência em transformar filmagens brutas em histórias envolventes." idPrefix="about-main" />
          </p>
        </div>

  <div className="w-full rounded-lg overflow-hidden">
        <img
          className="w-full h-auto object-cover"
          src="/linhadotempo.png"
          alt="Print do trabalho"
        />
  </div>
        {/* Linha 3: Texto secundário */}
        <div className="max-w-4xl ml-auto">
          <p className="font-[Plus_Jakarta_Sans] font-extralight text-[#d6dde6] text-lg sm:text-2xl lg:text-[46px] leading-relaxed lg:leading-[68px] tracking-tight lg:tracking-[-0.92px] text-right">
            <SplitText text="Meu trabalho abrange várias indústrias, trazendo um toque único a cada projeto." idPrefix="about-industries" />
          </p>
        </div>
      </div>
    </section>
  );
}
