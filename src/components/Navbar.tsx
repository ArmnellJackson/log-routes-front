/* Navbar translúcida con menú hamburguesa para móvil — React para estado interactivo */
import * as React from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Tutorial", href: "#tutorial" },
  { label: "Precios",  href: "#precios" },
];

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const close = React.useCallback(() => setIsOpen(false), []);

  return (
    <header className="relative z-50 w-full">
      {/* ── Barra principal ── */}
      <nav className="relative flex h-16 items-center justify-between px-6 md:px-12 bg-[#515763]/70 backdrop-blur-md border-b border-white/10">

        {/* Logo — izquierda */}
        <a href="/" className="shrink-0 flex items-center" aria-label="LogicRoutes — inicio">
          <span
            className="text-2xl tracking-widest text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Log<span className="text-[#ff5e00]">Routes</span>
          </span>
        </a>

        {/* Links — centro (solo desktop) */}
        <ul
          className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2"
          role="list"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="text-sm font-semibold tracking-wide text-white/75 hover:text-[#ff5e00] transition-colors duration-200"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Login icon — derecha (solo desktop) */}
        <button
          aria-label="Iniciar sesión"
          className="hidden md:flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white/70 hover:border-[#ff5e00] hover:text-[#ff5e00] transition-all duration-200 cursor-pointer"
        >
          <UserIcon />
        </button>

        {/* Botón hamburguesa — solo mobile */}
        <button
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-[5px] cursor-pointer -mr-1"
        >
          <span
            className={cn(
              "block h-[2px] w-5 bg-white rounded-full origin-center transition-transform duration-300",
              isOpen && "translate-y-[7px] rotate-45"
            )}
          />
          <span
            className={cn(
              "block h-[2px] w-5 bg-white rounded-full transition-opacity duration-300",
              isOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "block h-[2px] w-5 bg-white rounded-full origin-center transition-transform duration-300",
              isOpen && "-translate-y-[7px] -rotate-45"
            )}
          />
        </button>
      </nav>

      {/* ── Menú móvil ── */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#464d5a]/97 backdrop-blur-md border-b border-white/10",
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!isOpen}
      >
        <ul className="flex flex-col px-6 py-3">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label} className="border-b border-white/8 last:border-0">
              <a
                href={href}
                onClick={close}
                className="block py-3.5 text-base font-semibold text-white/80 hover:text-[#ff5e00] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {label}
              </a>
            </li>
          ))}
          {/* Login en menú móvil */}
          <li className="pt-4 pb-2">
            <a
              href="#login"
              onClick={close}
              className="inline-flex items-center gap-2.5 text-base font-semibold text-white/80 hover:text-[#ff5e00] transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <UserIcon />
              Iniciar sesión
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
