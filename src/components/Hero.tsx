/* Hero principal — React, pantalla completa sin scroll, tipografía centrada con animaciones.
   Conversión de Hero.astro a TSX para compartir estado con PageContent. */
import * as React from "react";

export function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-y-auto overflow-x-hidden py-6">

      {/* Patrón de fondo: grid de rutas (red de nodos) */}
      <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="route-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="white" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#route-grid)" />
        </svg>
      </div>

      {/* Resplandor de acento naranja centrado */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff5e00]/12 blur-[100px] pointer-events-none"
        style={{ width: "clamp(200px, 60vw, 600px)", height: "clamp(150px, 40vw, 400px)" }}
        aria-hidden="true"
      />

      {/* Destello secundario derecha (oculto en mobile) */}
      <div
        className="hidden sm:block absolute top-0 right-0 w-72 h-72 rounded-full bg-[#ff5e00]/6 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Contenido centrado */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full">

        {/* Eyebrow */}
        <p
          className="hero-fade-up text-xs md:text-sm font-bold tracking-[0.40em] text-[#ff5e00] uppercase mb-4"
          style={{ animationDelay: "0.1s" }}
        >
          Planifica tus rutas de forma inteligente
        </p>

        {/* Título principal: Bebas Neue, fluid type */}
        <h1
          className="hero-fade-up text-white leading-none mb-5 md:mb-6"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(5rem, 7vw, 7rem)",
            letterSpacing: "0.04em",
            animationDelay: "0.25s",
          }}
        >
          MEJORES<br />
          <span className="text-[#ff5e00]">RUTAS</span><br />
          SIN LÍMITES
        </h1>

        {/* Subtítulo */}
        <p
          className="hero-fade-up text-base md:text-lg text-white/65 max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed"
          style={{ fontFamily: "var(--font-sans)", animationDelay: "0.45s" }}
        >
          Completa tus entregas de forma eficiente y sin complicaciones.
        </p>

        {/* CTAs */}
        <div
          className="hero-fade-up flex flex-row items-center justify-center gap-3"
          style={{ animationDelay: "0.65s" }}
        >
          <a
            href="#"
            className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-[#ff5e00] text-white font-bold text-sm tracking-wide hover:bg-[#e65400] active:bg-[#cc4a00] transition-colors duration-200 shadow-lg shadow-[#ff5e00]/20"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Comenzar gratis
          </a>
          <a
            href="#tutorial"
            className="inline-flex items-center justify-center h-11 px-6 rounded-lg border border-white/20 text-white/80 font-semibold text-sm tracking-wide hover:border-white/40 hover:text-white transition-all duration-200"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Ver tutorial
            <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
