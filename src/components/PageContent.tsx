/* PageContent — orquesta el estado de navegación entre vistas (home / pricing / dashboard)
   y controla la apertura del AuthDialog. Persiste la vista activa en el hash de la URL
   para sobrevivir recargas. Dashboard cubre todo con fixed inset-0. */
import * as React from "react";
import { Navbar, type PageView } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PricingSection } from "@/components/PricingSection";
import { Dashboard } from "@/components/Dashboard";
import { AuthDialog } from "@/components/AuthDialog";

type AppView = PageView | "dashboard";

const VALID_VIEWS: AppView[] = ["home", "pricing", "dashboard"];

/* Lee la vista inicial del atributo data-view que el script inline de Layout.astro
   escribe sincrónicamente antes de que React hidrate — evita flash de vista incorrecta */
function readInitialView(): AppView {
  const v = document.documentElement.dataset.view as AppView;
  return VALID_VIEWS.includes(v) ? v : "home";
}

function readHash(): AppView {
  const hash = window.location.hash.slice(1) as AppView;
  return VALID_VIEWS.includes(hash) ? hash : "home";
}

function writeHash(v: AppView) {
  if (v === "home") {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  } else {
    history.replaceState(null, "", `#${v}`);
  }
}

export function PageContent() {
  const [view, setView]           = React.useState<AppView>("home");
  const [mounted, setMounted]     = React.useState(false);
  const [authOpen, setAuthOpen]   = React.useState(false);

  /* Primer render devuelve null (nada pintado); useEffect lee la vista correcta
     del data-view del inline script y activa el render definitivo */
  React.useEffect(() => {
    setView(readInitialView());
    setMounted(true);
    const handler = () => setView(readHash());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (v: AppView) => {
    setView(v);
    writeHash(v);
  };

  if (!mounted) return null;

  /* Solo pasa vistas de landing a Navbar */
  const landingView = view === "dashboard" ? undefined : (view as PageView);

  const handleNavigate = (v: PageView) => navigate(v);

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
      {view === "dashboard" && <Dashboard onExit={() => navigate("home")} />}

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onLoginSuccess={() => {
          setAuthOpen(false);
          navigate("dashboard");
        }}
      />
    </>
  );
}
