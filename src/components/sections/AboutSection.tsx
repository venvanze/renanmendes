import React from "react";
import type { AboutData, IndustriesData } from "../../types/content";
import imgScreenshot from "../../assets/6cae812fa25231b04e41bc7605770048b512563c.png";

interface AboutSectionProps {
  aboutData: AboutData;
  industriesData: IndustriesData;
}

export function AboutSection({ aboutData, industriesData }: AboutSectionProps) {
  if (!aboutData || !industriesData) return null;
  return (
    <section id="sobre" aria-label="Sobre" className="scroll-offset bg-[#080f17] px-4 md:px-8 lg:px-[190px] py-12 lg:py-36">
      <div className="space-y-6 lg:space-y-6">
        {/* Linha 1: Texto principal */}
        <div className="max-w-4xl">
          <p className="font-[Plus_Jakarta_Sans] font-bold text-[#d6dde6] text-lg sm:text-2xl lg:text-[46px] leading-relaxed lg:leading-[68px] tracking-tight lg:tracking-[-0.92px]">
            {aboutData.text}
          </p>
        </div>

        {/* Linha 2: Print do trabalho */}
        <div className="w-full rounded-lg overflow-hidden">
          <img
            className="w-full h-auto object-cover"
            src={imgScreenshot}
            alt="Print do trabalho"
          />
        </div>

        {/* Linha 3: Texto secundário (indústrias) */}
        <div className="max-w-4xl ml-auto">
          <p className="font-[Plus_Jakarta_Sans] font-extralight text-[#d6dde6] text-lg sm:text-2xl lg:text-[46px] leading-relaxed lg:leading-[68px] tracking-tight lg:tracking-[-0.92px] text-right">
            {industriesData.text}
          </p>
        </div>
      </div>
    </section>
  );
}
