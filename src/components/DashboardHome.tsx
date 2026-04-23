/* Vista Home del dashboard — mapa interactivo con ruta demo y controles.
   Usa mapcn (MapLibre GL + shadcn) con tema dark y una ruta de ejemplo por Lima. */
import { useState } from "react";
import {
  Map,
  MapControls,
  MapRoute,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
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

// ── Componente principal ──

export function DashboardHome() {
  const [userLocation, setUserLocation] = useState<{ longitude: number; latitude: number } | null>(null);

  return (
    <div className="absolute inset-0">
      <Map
        center={[-77.028, -12.095]}
        zoom={12}
        theme="dark"
        className="h-full w-full"
        attributionControl={false}
      >
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

        {/* Controles */}
        <MapControls
          position="bottom-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
          onLocate={setUserLocation}
        />
      </Map>
    </div>
  );
}
