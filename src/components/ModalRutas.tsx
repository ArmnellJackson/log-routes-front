/* ModalRutas — overlay fullscreen para crear/gestionar rutas.
   Lista de paradas reordenable con drag-and-drop (@dnd-kit/sortable).
   Al confirmar dispara fetch OSRM en Dashboard con el orden actual. */
import { X, Loader2, GripVertical } from "lucide-react";
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

// ── Item sortable individual ──

function SortableParadaItem({
  parada,
  index,
  onRemove,
}: {
  parada: Parada;
  index: number;
  onRemove: () => void;
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

// ── Modal principal ──

export function ModalRutas({
  paradas,
  onRemoveParada,
  onReorderParadas,
  onConfirmarRuta,
  rutaLoading,
  onClose,
}: ModalRutasProps) {
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
      </div>
    </div>
  );
}
