import React from "react";
import type { IndustriesData } from "../../types/content";

interface IndustriesSectionProps {
  industriesData: IndustriesData;
}

export function IndustriesSection({ industriesData }: IndustriesSectionProps) {
  if (!industriesData) return null;
  return (
    <section aria-label="Indústrias atendidas" className="bg-[#080f17] px-4 md:px-8 lg:px-[190px] py-12 lg:py-24">
      <div className="max-w-4xl ml-auto">
        <p className="font-[Plus_Jakarta_Sans] font-extralight text-[#d6dde6] text-lg sm:text-2xl lg:text-[46px] leading-relaxed lg:leading-[68px] tracking-tight lg:tracking-[-0.92px] text-right">
          {industriesData.text}
        </p>
      </div>
    </section>
  );
}

