// Proxy server-side hacia OSRM — evita CORS del browser.
// Recibe coordenadas como query param 'coords' en formato 'lng,lat;lng,lat...'
// y devuelve la geometría GeoJSON de la ruta calculada.
export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const coords = url.searchParams.get("coords");

  if (!coords) {
    return new Response(JSON.stringify({ error: "Parámetro 'coords' requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
    const res = await fetch(osrmUrl);

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `OSRM respondió ${res.status}` }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "No se pudo conectar con OSRM" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};
