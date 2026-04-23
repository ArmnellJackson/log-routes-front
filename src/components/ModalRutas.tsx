/* ModalRutas — overlay fullscreen para crear/gestionar rutas.
   fixed inset-0 con z alto para superar sidebar, backdrop y trigger del Dashboard.
   Lista las paradas agregadas desde el mapa; permite eliminarlas individualmente. */
import { X, MapPin } from "lucide-react";
import type { Parada } from "@/components/Dashboard";

export interface ModalRutasProps {
  paradas: Parada[];
  onRemoveParada: (id: string) => void;
  onClose: () => void;
}

export function ModalRutas({ paradas, onRemoveParada, onClose }: ModalRutasProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop — clic cierra el panel */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel central */}
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
                : `${paradas.length} parada${paradas.length !== 1 ? "s" : ""} agregada${paradas.length !== 1 ? "s" : ""}.`}
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

        {/* Lista de paradas */}
        <div className="px-3 py-3 space-y-1.5 max-h-72 overflow-y-auto">
          {paradas.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-6">
              Sin paradas aún. Clic en el mapa → Agregar Parada.
            </p>
          ) : (
            paradas.map((parada, i) => (
              <div
                key={parada.id}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-background border border-border hover:bg-accent/30 transition-colors group"
              >
                {/* Número */}
                <span className="flex items-center justify-center size-5 shrink-0 rounded-full bg-emerald-500 text-white text-[0.55rem] font-bold">
                  {i + 1}
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

                {/* Eliminar */}
                <button
                  onClick={() => onRemoveParada(parada.id)}
                  className="shrink-0 flex items-center justify-center size-6 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Eliminar parada"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer con acción */}
        {paradas.length > 0 && (
          <div className="px-4 pb-4 pt-2 border-t border-border">
            <button
              className="w-full text-xs font-medium py-2 px-3 rounded-lg bg-[#ff5e00] hover:bg-[#e55500] text-white transition-colors"
              onClick={onClose}
            >
              Confirmar Ruta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
