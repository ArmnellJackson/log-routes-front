/* Sección de planes y precios — 6 cards shadcn (diario → anual).
   Grid responsivo 1/2/3 columnas; tarjeta popular con borde naranja, anual con fondo destacado. */
import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Datos de planes ──

interface Plan {
  id: string;
  label: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  badge?: string;
  popular?: boolean;
  best?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "daily",
    label: "Diario",
    price: "$0.99",
    period: "día",
    description: "Ideal para prueba puntual o uso esporádico.",
    features: [
      "Hasta 10 rutas por día",
      "1 conductor",
      "Optimización básica",
      "Soporte por chat",
    ],
  },
  {
    id: "weekly",
    label: "Semanal",
    price: "$4.99",
    period: "semana",
    description: "Para trabajos de corta duración.",
    features: [
      "Hasta 50 rutas por día",
      "2 conductores",
      "Optimización básica",
      "Soporte por email",
      "Exportar rutas PDF",
    ],
  },
  {
    id: "monthly",
    label: "Mensual",
    price: "$14.99",
    period: "mes",
    description: "El plan preferido por equipos en crecimiento.",
    features: [
      "Rutas ilimitadas",
      "5 conductores",
      "Optimización avanzada",
      "Reportes mensuales",
      "Soporte prioritario",
      "Historial 30 días",
    ],
    badge: "Más popular",
    popular: true,
  },
  {
    id: "quarterly",
    label: "Trimestral",
    price: "$39.99",
    period: "3 meses",
    description: "Ahorra un 11 % respecto al plan mensual.",
    features: [
      "Todo lo del plan Mensual",
      "10 conductores",
      "API básica",
      "Historial 3 meses",
      "Notificaciones push",
    ],
    badge: "11 % ahorro",
  },
  {
    id: "biannual",
    label: "Semestral",
    price: "$69.99",
    period: "6 meses",
    description: "Ahorra un 22 % — más potencia, menos coste.",
    features: [
      "Todo lo del plan Trimestral",
      "20 conductores",
      "API completa",
      "Dashboard analítico",
      "Historial 6 meses",
      "Integración GPS",
    ],
    badge: "22 % ahorro",
  },
  {
    id: "annual",
    label: "Anual",
    price: "$119.99",
    period: "año",
    description: "Máxima potencia al menor coste por mes.",
    features: [
      "Todo lo del plan Semestral",
      "Conductores ilimitados",
      "API + Webhooks",
      "Onboarding personalizado",
      "SLA garantizado 99.9 %",
      "Historial ilimitado",
    ],
    badge: "Mejor valor",
    best: true,
  },
];

// ── Icono check ──

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[#ff5e00]"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── Card individual ──

function PlanCard({ plan }: { plan: Plan }) {
  const isHighlighted = plan.popular || plan.best;

  return (
    <Card
      className={cn(
        "relative flex flex-col transition-transform duration-200 hover:-translate-y-1",
        plan.popular && "ring-2 ring-[#ff5e00]",
        plan.best && "bg-[#3d4350] ring-2 ring-[#ff5e00]/60"
      )}
    >
      {/* Badge */}
      {plan.badge && (
        <span
          className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[0.6rem] font-bold tracking-widest uppercase",
            isHighlighted
              ? "bg-[#ff5e00] text-white"
              : "bg-white/10 text-white/70"
          )}
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {plan.badge}
        </span>
      )}

      <CardHeader className="pt-6">
        <CardTitle
          className="text-base md:text-lg tracking-wide"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {plan.label}
        </CardTitle>
        <CardDescription className="text-white/50 md:text-xs">
          {plan.description}
        </CardDescription>
      </CardHeader>

      {/* Precio */}
      <CardContent className="pb-0">
        <div className="flex items-end gap-1 mb-4">
          <span
            className="text-3xl md:text-4xl font-bold text-white leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {plan.price}
          </span>
          <span
            className="text-xs text-white/40 mb-0.5"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            / {plan.period}
          </span>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-2">
          {plan.features.map((feat) => (
            <li
              key={feat}
              className="flex items-center gap-2 text-[0.7rem] md:text-xs text-white/70"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <CheckIcon />
              {feat}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto pt-5">
        <Button
          className={cn(
            "w-full cursor-pointer",
            isHighlighted
              ? "bg-[#ff5e00] hover:bg-[#e65400] text-white"
              : "variant-outline border-white/20 text-white/80 hover:border-[#ff5e00] hover:text-[#ff5e00]"
          )}
          variant={isHighlighted ? "default" : "outline"}
        >
          Elegir {plan.label.toLowerCase()}
        </Button>
      </CardFooter>
    </Card>
  );
}

// ── Sección principal ──

export function PricingSection() {
  return (
    <section className="overflow-y-auto overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-6 py-1 md:py-1">

        {/* Encabezado */}
        <div className="text-center mb-1 md:mb-1">
          <p
            className="text-xs font-bold tracking-[0.40em] text-[#ff5e00] uppercase mb-1"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Acceco Inmediato
          </p>
          <h2
            className="text-white leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              letterSpacing: "0.04em",
            }}
          >
            ELIGE TU <span className="text-[#ff5e00]">PLAN</span>
          </h2>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
