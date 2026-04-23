/* Vista Home del dashboard — mapa interactivo con ruta demo, controles y búsqueda de dirección.
   Selección por clic o búsqueda Nominatim: marcador pin y popup con nombre de calle y coords. */
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import {
  Map,
  MapControls,
  MapRoute,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapPopup,
  useMap,
} from "@/components/ui/map";

// ── Ruta demo — Lima, Perú ──

const ROUTE: [number, number][] = [
  [-77.0282, -12.0454], // Lima Centro — Plaza Mayor
  [-77.0365, -12.0951], // San Isidro
  [-77.0306, -12.1207], // Miraflores
  [-77.0213, -12.1451], // Barranco
];

const STOPS = [
  { name: "Plaza Mayor",  lng: -77.0282, lat: -12.0454 },
  { name: "San Isidro",   lng: -77.0365, lat: -12.0951 },
  { name: "Miraflores",   lng: -77.0306, lat: -12.1207 },
  { name: "Barranco",     lng: -77.0213, lat: -12.1451 },
];

// ── Marcador numerado ──

function StopMarker({ index }: { index: number }) {
  return (
    <div className="flex items-center justify-center size-6 rounded-full bg-[#ff5e00] border-2 border-white shadow-lg text-white text-[0.6rem] font-bold">
      {index + 1}
    </div>
  );
}

// ── Marcador de ubicación actual ──

function UserLocationMarker() {
  return (
    <div className="relative flex items-center justify-center size-4">
      <div className="absolute size-4 rounded-full bg-blue-500/30 animate-ping" />
      <div className="size-3 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
    </div>
  );
}

// ── Marcador de pin seleccionado ──

function SelectedPinMarker() {
  return (
    <div className="flex items-center justify-center size-5 rounded-full bg-white border-2 border-[#ff5e00] shadow-lg">
      <div className="size-2 rounded-full bg-[#ff5e00]" />
    </div>
  );
}

// ── Handler de clic en mapa — activa cursor crosshair y emite coordenadas ──

function MapClickHandler({ onClick }: { onClick: (lngLat: { lng: number; lat: number }) => void }) {
  const { map, isLoaded } = useMap();
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  useEffect(() => {
    if (!map || !isLoaded) return;
    map.getCanvas().style.cursor = "crosshair";
    const handle = (e: { lngLat: { lng: number; lat: number } }) =>
      onClickRef.current({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    map.on("click", handle);
    return () => {
      map.off("click", handle);
      map.getCanvas().style.cursor = "";
    };
  }, [map, isLoaded]);

  return null;
}

// ── Tipos ──

interface SelectedPin {
  lng: number;
  lat: number;
  label: string | null;
  loading: boolean;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// ── Overlay de búsqueda de dirección sobre el mapa ──

function MapSearchOverlay({ onSelect }: {
  onSelect: (lng: number, lat: number, label: string) => void;
}) {
  const { map } = useMap();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setShowResults(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (value.trim().length < 3) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5`,
          { headers: { "Accept-Language": "es" } },
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const handleSelect = (result: NominatimResult) => {
    const lng = parseFloat(result.lon);
    const lat = parseFloat(result.lat);
    const label = result.display_name.split(",")[0].trim();
    map?.flyTo({ center: [lng, lat], zoom: 15, duration: 800 });
    onSelect(lng, lat, label);
  };

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-80 max-w-[calc(100%-1rem)]">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Buscar dirección…"
          className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-border bg-popover/95 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
          style={{ fontFamily: "var(--font-sans)" }}
          autoComplete="off"
        />
      </div>
      {showResults && (results.length > 0 || isSearching) && (
        <ul
          className="mt-1 w-full bg-popover/95 backdrop-blur-sm border border-border rounded-lg shadow-xl overflow-hidden text-xs"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {isSearching && (
            <li className="px-3 py-2 text-muted-foreground">Buscando…</li>
          )}
          {results.map((r) => (
            <li
              key={r.place_id}
              className="px-3 py-2 cursor-pointer hover:bg-accent truncate"
              onMouseDown={() => handleSelect(r)}
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Componente principal ──

export function DashboardHome() {
  const [userLocation, setUserLocation] = useState<{ longitude: number; latitude: number } | null>(null);
  const [selectedPin, setSelectedPin] = useState<SelectedPin | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleMapClick = async ({ lng, lat }: { lng: number; lat: number }) => {
    setSelectedPin({ lng, lat, label: null, loading: true });
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`,
        { headers: { "Accept-Language": "es" } },
      );
      const data = await res.json();
      const addr = data.address ?? {};
      // Prioridad: road > neighbourhood > suburb > town > city
      const label = addr.road ?? addr.neighbourhood ?? addr.suburb ?? addr.town ?? addr.city ?? data.display_name?.split(",")[0] ?? null;
      setSelectedPin((prev) => prev && prev.lng === lng && prev.lat === lat ? { ...prev, label, loading: false } : prev);
    } catch {
      setSelectedPin((prev) => prev && prev.lng === lng && prev.lat === lat ? { ...prev, loading: false } : prev);
    }
  };

  return (
    <div className="absolute inset-0">
      <Map
        center={[-77.028, -12.095]}
        zoom={12}
        theme="dark"
        className="h-full w-full"
        attributionControl={false}
      >
        {/* Overlay de búsqueda */}
        {searchOpen && (
          <MapSearchOverlay
            onSelect={(lng, lat, label) => {
              setSelectedPin({ lng, lat, label, loading: false });
              setSearchOpen(false);
            }}
          />
        )}

        {/* Captura clics en el mapa */}
        <MapClickHandler onClick={handleMapClick} />

        {/* Ruta naranja LogicRoutes */}
        <MapRoute
          coordinates={ROUTE}
          color="#ff5e00"
          width={4}
          opacity={0.85}
        />

        {/* Paradas con tooltip */}
        {STOPS.map((stop, i) => (
          <MapMarker key={stop.name} longitude={stop.lng} latitude={stop.lat}>
            <MarkerContent>
              <StopMarker index={i} />
            </MarkerContent>
            <MarkerTooltip>{stop.name}</MarkerTooltip>
          </MapMarker>
        ))}

        {/* Marcador ubicación actual */}
        {userLocation && (
          <MapMarker longitude={userLocation.longitude} latitude={userLocation.latitude}>
            <MarkerContent>
              <UserLocationMarker />
            </MarkerContent>
            <MarkerTooltip>Mi ubicación</MarkerTooltip>
          </MapMarker>
        )}

        {/* Marcador + popup del punto seleccionado */}
        {selectedPin && (
          <>
            <MapMarker longitude={selectedPin.lng} latitude={selectedPin.lat}>
              <MarkerContent>
                <SelectedPinMarker />
              </MarkerContent>
            </MapMarker>
            <MapPopup
              longitude={selectedPin.lng}
              latitude={selectedPin.lat}
              closeButton
              onClose={() => setSelectedPin(null)}
              className="min-w-[160px]"
            >
              <div className="space-y-1" style={{ fontFamily: "var(--font-sans)" }}>
                {selectedPin.loading ? (
                  <p className="text-xs text-muted-foreground">Obteniendo información…</p>
                ) : (
                  <p className="text-xs font-semibold leading-tight">
                    {selectedPin.label ?? "Ubicación seleccionada"}
                  </p>
                )}
                <p className="text-[0.65rem] font-mono text-muted-foreground">
                  {selectedPin.lng.toFixed(5)}, {selectedPin.lat.toFixed(5)}
                </p>
              </div>
            </MapPopup>
          </>
        )}

        {/* Controles */}
        <MapControls
          position="bottom-right"
          showSearch
          showZoom
          showCompass
          showLocate
          showFullscreen
          onLocate={setUserLocation}
          onSearchToggle={() => setSearchOpen((prev) => !prev)}
        />
      </Map>
    </div>
  );
}
