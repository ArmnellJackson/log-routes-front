/* PageContent — orquesta el estado de navegación entre vistas (Home / Pricing).
   Renderiza Navbar + sección activa como fragmento para participar en el grid del body. */
import * as React from "react";
import { Navbar, type PageView } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PricingSection } from "@/components/PricingSection";

export function PageContent() {
  const [view, setView] = React.useState<PageView>("home");

  return (
    <>
      <Navbar currentView={view} onNavigate={setView} />
      {view === "home"    && <Hero />}
      {view === "pricing" && <PricingSection />}
    </>
  );
}
