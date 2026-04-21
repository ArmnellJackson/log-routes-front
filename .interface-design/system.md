# LogicRoutes — Sistema de Diseño

## Dirección y Concepto
**Dominio**: rutas, nodos, redes, algoritmos, flujos, cartografía de caminos
**Feel**: bold, técnico, energético — asfalto nocturno con señales naranja
**Signature**: grid SVG de nodos/rutas como patrón de fondo, naranja en palabra clave del título

## Paleta (CSS Variables en :root)
| Token          | Valor       | Uso                          |
|----------------|-------------|------------------------------|
| `--background` | `#515763`   | Fondo principal (gris-azul)  |
| `--primary`    | `#ff5e00`   | Naranja de acento/identidad  |
| `--foreground` | `#ffffff`   | Texto primario               |
| `--card`       | `#5c6270`   | Superficie elevada nivel 1   |
| `--popover`    | `#464d5a`   | Superficie elevada nivel 2   |
| `--border`     | `rgba(255,255,255,0.1)` | Separadores sutiles |
| `--muted-foreground` | `rgba(255,255,255,0.5)` | Texto secundario |

Uso en Tailwind: `bg-background`, `text-primary`, `bg-card`, etc.
Uso arbitrario para hover states: `hover:text-[#ff5e00]`, `bg-[#ff5e00]`

## Tipografía
| Familia        | Variable CSS            | Clase Tailwind   | Uso          |
|----------------|-------------------------|------------------|--------------|
| Bebas Neue     | `var(--font-display)`   | `font-display`   | Títulos H1–H6 |
| Smooch Sans    | `var(--font-sans)`      | `font-sans`      | Cuerpo, nav, labels |

Cargadas vía Google Fonts en `Layout.astro` (preconnect + stylesheet link).
Los `h1–h6` usan `font-display` por default en `@layer base`.

## Tipografía Fluida — Hero
```
font-size: clamp(4.5rem, 13vw, 11rem)
```
Eyebrow: `text-xs md:text-sm` + `tracking-[0.35em]`

## Depth Strategy: Superficies con color shift
- Sin box-shadow decorativos
- Elevación por cambio de lightness: `--background` → `--card` → `--popover`
- Navbar/Footer: `backdrop-blur-md` + `bg-[#515763]/70`
- Separadores: `border border-white/10`

## Espaciado Base
- Navbar height: `h-16` (64px)
- Padding horizontal: `px-6 md:px-12`
- Sections: `max-w-7xl mx-auto`
- Hero max-width: `max-w-5xl`

## Radio
- Botones: `rounded-lg` (0.5rem)
- Login icon: `rounded-full`
- Blobs/glow: `rounded-full`

## Componentes Clave

### Navbar
- `sticky top-0 z-50` — se adhiere al scroll
- `bg-[#515763]/70 backdrop-blur-md` — translúcida
- Logo izquierda | links centro (absolute + translate) | icon derecha
- Mobile: hamburguesa `w-11 h-11` (44px touch target) + menú `max-h-0→max-h-80` con transition

### Hero
- `flex-1` dentro de `h-dvh flex flex-col`
- Patrón SVG grid (64x64) con `opacity-[0.06]`
- Glow naranja: `clamp(280px, 70vw, 700px)` para no desbordar en mobile
- Animación `.hero-fade-up` con stagger via `animation-delay`
- CTAs: `flex-col sm:flex-row`

### Footer
- `shrink-0 border-t border-white/10`
- 3 columnas desktop | 2 filas mobile (flex-wrap + order)
- Link "Creado por Jackson-Dev" → https://jackson-dev.vercel.app/

## Responsive
- Breakpoints: mobile-first con Tailwind (`sm:`, `md:`, `lg:`)
- Viewport: `h-dvh` (no `h-screen`) para iOS Safari
- Touch targets: mínimo 44px en mobile
- `prefers-reduced-motion`: desactiva `.hero-fade-up`
- Glow/efectos blur: `hidden sm:block` en elementos decorativos secundarios

## Stack
- Astro 6 + React 19 (`@astrojs/react`)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- shadcn/ui (style: radix-mira, iconos: hugeicons)
- tw-animate-css para utilities de animación
