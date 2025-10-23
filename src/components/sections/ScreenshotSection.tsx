import React from "react";
import imgScreenshot from "../../assets/6cae812fa25231b04e41bc7605770048b512563c.png";

export function ScreenshotSection() {
  return (
    <section aria-label="Captura de tela" className="px-4 md:px-8 lg:px-[190px] py-8 lg:py-12">
      <div className="w-full rounded-lg overflow-hidden">
        <img className="w-full h-auto object-cover" src={imgScreenshot} alt="Exemplo de interface ou trabalho em destaque" />
      </div>
    </section>
  );
}

