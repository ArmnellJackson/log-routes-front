/* ModalRutas — overlay fullscreen para crear/gestionar rutas.
   Lista de paradas reordenable con drag-and-drop (@dnd-kit/sortable).
   Al confirmar dispara fetch OSRM en Dashboard con el orden actual.
   Botón "Ir" en cada parada: obtiene geolocalización y abre Google Maps o Waze. */
import { useState, useEffect } from "react";
import { X, Loader2, GripVertical, Navigation, MapPin } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Parada } from "@/components/Dashboard";

export interface ModalRutasProps {
  paradas: Parada[];
  onRemoveParada: (id: string) => void;
  onReorderParadas: (paradas: Parada[]) => void;
  onConfirmarRuta: () => void;
  rutaLoading: boolean;
  onClose: () => void;
}

// ── Tipos internos ──

type Plataforma = "google" | "waze";

interface CoordsOrigen {
  lat: number;
  lng: number;
}

// ── Detección de dispositivo móvil nativo por userAgent ──

function esDispositivoMovil(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// ── Construcción y apertura de URL de navegación ──

function abrirNavegacion(
  plataforma: Plataforma,
  origen: CoordsOrigen,
  destino: { lat: number; lng: number },
  esMobile: boolean,
): void {
  if (plataforma === "google") {
    // URL universal: abre la app en móvil si está instalada, web en PC
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origen.lat},${origen.lng}&destination=${destino.lat},${destino.lng}&travelmode=driving`;
    window.open(url, "_blank");
    return;
  }

  // Waze
  if (esMobile) {
    // Intenta deep link; si la app no está instalada, fallback a web tras 1.5s
    const deepLink = `waze://?ll=${destino.lat},${destino.lng}&navigate=yes`;
    const webUrl = `https://waze.com/ul?ll=${destino.lat},${destino.lng}&navigate=yes`;
    window.location.href = deepLink;
    setTimeout(() => window.open(webUrl, "_blank"), 1500);
  } else {
    window.open(
      `https://waze.com/ul?ll=${destino.lat},${destino.lng}&navigate=yes`,
      "_blank",
    );
  }
}

// ── Item sortable individual ──

function SortableParadaItem({
  parada,
  index,
  onRemove,
  onIr,
}: {
  parada: Parada;
  index: number;
  onRemove: () => void;
  onIr: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: parada.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-background border border-border hover:bg-accent/30 transition-colors group"
    >
      {/* Handle drag */}
      <button
        {...attributes}
        {...listeners}
        className="shrink-0 flex items-center justify-center size-5 text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing touch-none"
        aria-label="Arrastrar parada"
        tabIndex={-1}
      >
        <GripVertical className="size-3.5" />
      </button>

      {/* Número */}
      <span className="flex items-center justify-center size-5 shrink-0 rounded-full bg-emerald-500 text-white text-[0.55rem] font-bold">
        {index + 1}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate leading-tight">
          {parada.label}
        </p>
        <p className="text-[0.6rem] font-mono text-muted-foreground leading-tight mt-0.5">
          {parada.lng.toFixed(5)}, {parada.lat.toFixed(5)}
        </p>
      </div>

      {/* Ir */}
      <button
        onClick={onIr}
        className="shrink-0 flex items-center justify-center gap-1 px-2 h-6 rounded-md text-[0.6rem] font-semibold text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
        aria-label={`Ir a ${parada.label}`}
      >
        <Navigation className="size-3" />
        Ir
      </button>

      {/* Eliminar */}
      <button
        onClick={onRemove}
        className="shrink-0 flex items-center justify-center size-6 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
        aria-label="Eliminar parada"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

// ── Diálogo selector de plataforma de navegación ──

function DialogNavegar({
  parada,
  onCerrar,
}: {
  parada: Parada;
  onCerrar: () => void;
}) {
  const [estado, setEstado] = useState<"obteniendo" | "listo" | "error">("obteniendo");
  const [coords, setCoords] = useState<CoordsOrigen | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Obtiene geolocalización al montar
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocalización no disponible en este dispositivo.");
      setEstado("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setEstado("listo");
      },
      (err) => {
        const mensajes: Record<number, string> = {
          1: "Permiso de ubicación denegado.",
          2: "No se pudo determinar la ubicación.",
          3: "Tiempo de espera agotado al obtener ubicación.",
        };
        setErrorMsg(mensajes[err.code] ?? "Error al obtener ubicación.");
        setEstado("error");
      },
      { timeout: 10000, maximumAge: 30000 },
    );
  }, []);

  const manejarPlataforma = (plataforma: Plataforma) => {
    if (!coords) return;
    abrirNavegacion(
      plataforma,
      coords,
      { lat: parada.lat, lng: parada.lng },
      esDispositivoMovil(),
    );
    onCerrar();
  };

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl">
      {/* Fondo semitransparente dentro del panel */}
      <div className="absolute inset-0 bg-popover/90 backdrop-blur-[2px] rounded-xl" />

      <div className="relative z-10 w-full max-w-[280px] mx-4 bg-popover border border-border rounded-xl shadow-xl p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-foreground">Navegar a</p>
            <p className="text-[0.65rem] text-muted-foreground mt-0.5 max-w-[190px] truncate">
              {parada.label}
            </p>
          </div>
          <button
            onClick={onCerrar}
            className="flex items-center justify-center size-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Cerrar"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Contenido según estado */}
        {estado === "obteniendo" && (
          <div className="flex flex-col items-center gap-2 py-4">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
            <p className="text-[0.65rem] text-muted-foreground">Obteniendo tu ubicación…</p>
          </div>
        )}

        {estado === "error" && (
          <div className="flex flex-col items-center gap-2 py-3">
            <MapPin className="size-5 text-destructive" />
            <p className="text-[0.65rem] text-center text-destructive">{errorMsg}</p>
            <button
              onClick={onCerrar}
              className="mt-1 text-[0.65rem] underline text-muted-foreground hover:text-foreground"
            >
              Cerrar
            </button>
          </div>
        )}

        {estado === "listo" && (
          <div className="space-y-2">
            <p className="text-[0.65rem] text-muted-foreground mb-2">
              Elige plataforma de navegación:
            </p>

            {/* Google Maps */}
            <button
              onClick={() => manejarPlataforma("google")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border hover:bg-accent/40 transition-colors text-left"
            >
              {/* Ícono Google Maps SVG */}
              <svg
                className="size-5 shrink-0"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24 2C15.163 2 8 9.163 8 18c0 12.75 16 28 16 28s16-15.25 16-28c0-8.837-7.163-16-16-16z" fill="#EA4335"/>
                <path d="M24 2C15.163 2 8 9.163 8 18c0 12.75 16 28 16 28V2z" fill="#FBBC04"/>
                <circle cx="24" cy="18" r="6" fill="white"/>
              </svg>
              <div>
                <p className="text-xs font-medium text-foreground">Google Maps</p>
                <p className="text-[0.6rem] text-muted-foreground">
                  {esDispositivoMovil() ? "Abre la app o web" : "Abre en navegador"}
                </p>
              </div>
            </button>

            {/* Waze */}
            <button
              onClick={() => manejarPlataforma("waze")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border hover:bg-accent/40 transition-colors text-left"
            >
              {/* Ícono Waze SVG */}
              <svg
                className="size-5 shrink-0"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse cx="24" cy="22" rx="18" ry="16" fill="#33CCFF"/>
                <path d="M24 38c0 0-6-3-10-8" stroke="#009BCC" strokeWidth="2" fill="none"/>
                <circle cx="18" cy="26" r="2.5" fill="white"/>
                <circle cx="30" cy="26" r="2.5" fill="white"/>
                <path d="M19 30c1.5 2 8.5 2 10 0" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <ellipse cx="33" cy="12" rx="5" ry="4" fill="#FFC0CB"/>
                <circle cx="33" cy="12" r="2" fill="white"/>
              </svg>
              <div>
                <p className="text-xs font-medium text-foreground">Waze</p>
                <p className="text-[0.6rem] text-muted-foreground">
                  {esDispositivoMovil() ? "Abre la app o web" : "Abre en navegador"}
                </p>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Modal principal ──

export function ModalRutas({
  paradas,
  onRemoveParada,
  onReorderParadas,
  onConfirmarRuta,
  rutaLoading,
  onClose,
}: ModalRutasProps) {
  const [paradaNavegar, setParadaNavegar] = useState<Parada | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = paradas.findIndex((p) => p.id === active.id);
    const newIndex = paradas.findIndex((p) => p.id === over.id);
    onReorderParadas(arrayMove(paradas, oldIndex, newIndex));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-md mx-4 bg-popover border border-border rounded-xl shadow-2xl"
        style={{ fontFamily: "var(--font-sans)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Crear Ruta</h2>
            <p className="text-[0.65rem] text-muted-foreground mt-0.5">
              {paradas.length === 0
                ? "Haz clic en el mapa y agrega paradas."
                : `${paradas.length} parada${paradas.length !== 1 ? "s" : ""} — arrastra para reordenar.`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Lista sortable */}
        <div className="px-3 py-3 space-y-1.5 max-h-72 overflow-y-auto">
          {paradas.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-6">
              Sin paradas aún. Clic en el mapa → Agregar Parada.
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={paradas.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1.5">
                  {paradas.map((parada, i) => (
                    <SortableParadaItem
                      key={parada.id}
                      parada={parada}
                      index={i}
                      onRemove={() => onRemoveParada(parada.id)}
                      onIr={() => setParadaNavegar(parada)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Footer */}
        {paradas.length > 0 && (
          <div className="px-4 pb-4 pt-2 border-t border-border space-y-1.5">
            {paradas.length < 2 && (
              <p className="text-[0.65rem] text-center text-muted-foreground">
                Agrega al menos 2 paradas para calcular la ruta.
              </p>
            )}
            <button
              disabled={paradas.length < 2 || rutaLoading}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg bg-[#ff5e00] hover:bg-[#e55500] disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
              onClick={onConfirmarRuta}
            >
              {rutaLoading && <Loader2 className="size-3.5 animate-spin" />}
              {rutaLoading ? "Calculando ruta…" : "Confirmar Ruta"}
            </button>
          </div>
        )}

        {/* Diálogo de navegación (superpuesto sobre el panel) */}
        {paradaNavegar && (
          <DialogNavegar
            parada={paradaNavegar}
            onCerrar={() => setParadaNavegar(null)}
          />
        )}
      </div>
    </div>
  );
}
