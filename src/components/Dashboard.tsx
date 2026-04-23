/* Dashboard principal — pantalla completa (fixed inset-0) que cubre Navbar y Footer.
   Sidebar shadcn: Header con logo, sección Home y Ruta, Footer con usuario mock + dropdown.
   Gestiona estado de paradas (sessionStorage) y lo pasa a DashboardHome y ModalRutas. */
import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon, ArrowUpDownIcon } from "@hugeicons/core-free-icons";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DashboardHome } from "@/components/DashboardHome";
import { ModalRutas } from "@/components/ModalRutas";

// ── Tipo compartido: parada de ruta ──

export interface Parada {
  id: string;
  lng: number;
  lat: number;
  label: string;
}

const SESSION_KEY = "log-routes-paradas";

// ── Usuario mock ──

const MOCK_USER = {
  name: "Jackson Demo",
  email: "jackson@logroutes.com",
  initials: "JD",
};

// ── Icono Home ──

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

// ── Icono Ruta ──

function RouteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M6 17V9a6 6 0 0 1 6-6h1" />
      <path d="M18 7v8a6 6 0 0 1-6 6h-1" />
    </svg>
  );
}

// ── Avatar con iniciales ──

function UserAvatar({ initials }: { initials: string }) {
  return (
    <div className="flex items-center justify-center size-7 shrink-0 rounded-full bg-[#ff5e00] text-white text-[0.6rem] font-bold">
      {initials}
    </div>
  );
}

// ── Backdrop — cierra sidebar al pulsar fuera ──

function SidebarBackdrop() {
  const { state, toggleSidebar, isMobile, openMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : state === "expanded";
  if (!isOpen) return null;
  // z-[5] — por debajo del Sidebar (z-10 interno) para no interceptar sus clicks
  return (
    <div
      className="absolute inset-0 z-[5]"
      onClick={toggleSidebar}
      aria-hidden="true"
    />
  );
}

// ── Trigger hamburguesa flotante ──

function DashboardTrigger() {
  const { toggleSidebar, openMobile, isMobile, state } = useSidebar();
  const isOpen = isMobile ? openMobile : state === "expanded";

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      className="absolute top-3 z-20 flex flex-col justify-center items-center w-9 h-9 gap-[5px] cursor-pointer rounded-md hover:bg-white/5 transition-[left] duration-200 ease-in-out"
      style={{
        left: isOpen
          ? `calc(var(${isMobile ? "--sidebar-width-mobile" : "--sidebar-width"}) + 0.75rem)`
          : "0.75rem",
      }}
    >
      <span className={cn("block h-[2px] w-5 bg-white rounded-full origin-center transition-transform duration-300", isOpen && "translate-y-[7px] rotate-45")} />
      <span className={cn("block h-[2px] w-5 bg-white rounded-full transition-opacity duration-300", isOpen && "opacity-0")} />
      <span className={cn("block h-[2px] w-5 bg-white rounded-full origin-center transition-transform duration-300", isOpen && "-translate-y-[7px] -rotate-45")} />
    </button>
  );
}

// ── Sidebar ──

function DashboardSidebar({ onExit, onRutaClick }: { onExit: () => void; onRutaClick: () => void }) {
  const { isMobile, setOpen, setOpenMobile } = useSidebar();
  const handleRuta = () => {
    // Cierra sidebar (offcanvas) antes de abrir el modal para evitar conflictos de stacking
    if (isMobile) setOpenMobile(false);
    else setOpen(false);
    onRutaClick();
  };
  return (
    <Sidebar collapsible="offcanvas">

      {/* Header — logo navega al inicio */}
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <button
          type="button"
          onClick={onExit}
          className="cursor-pointer text-left"
          aria-label="Ir al inicio"
        >
          <span
            className="text-xl tracking-widest text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Log<span className="text-[#ff5e00]">Routes</span>
          </span>
        </button>
      </SidebarHeader>

      {/* Contenido — sección Home */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <HomeIcon />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleRuta}
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <RouteIcon />
                  <span>Ruta</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — usuario mock con dropdown de sesión */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <UserAvatar initials={MOCK_USER.initials} />
                  <div className="flex flex-col text-left leading-tight overflow-hidden">
                    <span className="truncate text-xs font-semibold text-white">
                      {MOCK_USER.name}
                    </span>
                    <span className="truncate text-[0.6rem] text-white/50">
                      {MOCK_USER.email}
                    </span>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowUpDownIcon}
                    strokeWidth={2}
                    className="ml-auto size-3.5 shrink-0 text-white/40"
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-48"
              >
                <DropdownMenuItem
                  onClick={onExit}
                  className="cursor-pointer gap-2"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} className="size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  );
}

// ── Componente principal ──

export interface DashboardProps {
  onExit: () => void;
}

export function Dashboard({ onExit }: DashboardProps) {
  const [rutaDialogOpen, setRutaDialogOpen] = React.useState(false);

  // Paradas persistidas en sessionStorage (sobreviven navegación, no recarga)
  const [paradas, setParadas] = React.useState<Parada[]>(() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "[]"); } catch { return []; }
  });

  // Geometría de ruta real calculada por OSRM al confirmar
  const [rutaGeometry, setRutaGeometry] = React.useState<[number, number][] | null>(null);
  const [rutaLoading, setRutaLoading] = React.useState(false);

  React.useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(paradas));
  }, [paradas]);

  const handleAgregarParada = (p: Parada) =>
    setParadas((prev) => [...prev, p]);

  const handleRemoveParada = (id: string) => {
    setParadas((prev) => prev.filter((p) => p.id !== id));
    setRutaGeometry(null);
  };

  const handleReorderParadas = (reordered: Parada[]) => {
    setParadas(reordered);
    // Reordenar invalida la ruta calculada — hay que reconfirmar
    setRutaGeometry(null);
  };

  // Llama OSRM driving route y dibuja la geometría real en el mapa
  const handleConfirmarRuta = async () => {
    if (paradas.length < 2) return;
    setRutaLoading(true);
    try {
      const coords = paradas.map((p) => `${p.lng},${p.lat}`).join(";");
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
      );
      const data = await res.json();
      const geometry: [number, number][] = data.routes[0].geometry.coordinates;
      setRutaGeometry(geometry);
      setRutaDialogOpen(false);
    } catch {
      // mantiene estado anterior si falla la red
    } finally {
      setRutaLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <SidebarProvider defaultOpen={false} className="dashboard-overlay">
        <DashboardSidebar onExit={onExit} onRutaClick={() => setRutaDialogOpen(true)} />

        <SidebarInset className="relative bg-background">
          {/* Hamburguesa flotante — se desplaza con el sidebar */}
          <DashboardTrigger />

          {/* Backdrop — clic fuera del sidebar lo cierra */}
          <SidebarBackdrop />

          <DashboardHome
            paradas={paradas}
            onAgregarParada={handleAgregarParada}
            rutaGeometry={rutaGeometry}
          />
        </SidebarInset>
      </SidebarProvider>

      {/* Modal a nivel raíz del Dashboard — evita anidamiento en SidebarInset/Map */}
      {rutaDialogOpen && (
        <ModalRutas
          paradas={paradas}
          onRemoveParada={handleRemoveParada}
          onReorderParadas={handleReorderParadas}
          onConfirmarRuta={handleConfirmarRuta}
          rutaLoading={rutaLoading}
          onClose={() => setRutaDialogOpen(false)}
        />
      )}
    </div>
  );
}
