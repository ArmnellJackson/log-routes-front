/* PageContent — orquesta el estado de navegación entre vistas (home / pricing / dashboard)
   y controla la apertura del AuthDialog. Renderiza Navbar + sección activa como fragmento
   para participar en el grid del body; Dashboard cubre todo con fixed inset-0. */
import * as React from "react";
import { Navbar, type PageView } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PricingSection } from "@/components/PricingSection";
import { Dashboard } from "@/components/Dashboard";
import { AuthDialog } from "@/components/AuthDialog";

type AppView = PageView | "dashboard";

export function PageContent() {
  const [view, setView]       = React.useState<AppView>("home");
  const [authOpen, setAuthOpen] = React.useState(false);

  /* Solo pasa vistas de landing a Navbar */
  const landingView = view === "dashboard" ? undefined : (view as PageView);

  const handleNavigate = (v: PageView) => setView(v);

  return (
    <>
      {/* Navbar solo en vistas de landing — Dashboard tiene su propio layout */}
      {view !== "dashboard" && (
        <Navbar
          currentView={landingView}
          onNavigate={handleNavigate}
          onAuthOpen={() => setAuthOpen(true)}
        />
      )}

      {view === "home"    && <Hero />}
      {view === "pricing" && <PricingSection />}

      {/* Dashboard — fixed inset-0, cubre Navbar y Footer del landing */}
      {view === "dashboard" && <Dashboard onExit={() => setView("home")} />}

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onLoginSuccess={() => {
          setAuthOpen(false);
          setView("dashboard");
        }}
      />
    </>
  );
}
