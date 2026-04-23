/* ModalRutas — overlay fullscreen para crear/gestionar rutas.
   fixed inset-0 con z alto para superar sidebar, backdrop y trigger del Dashboard. */
import { X } from "lucide-react";

export interface ModalRutasProps {
  onClose: () => void;
}

export function ModalRutas({ onClose }: ModalRutasProps) {
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
              Agrega paradas para definir tu ruta de entrega.
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

        {/* Contenido */}
        <div className="px-4 py-5 text-xs text-muted-foreground">
          {/* TODO: selector de paradas */}
          Próximamente: selector de paradas en el mapa.
        </div>
      </div>
    </div>
  );
}
