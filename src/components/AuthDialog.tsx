/* Formulario de autenticación (login / registro / recuperar contraseña) —
   Dialog de shadcn con sistema de diseño LogicRoutes. Gestiona tres vistas
   mediante estado interno; se resetea a "login" al cerrarse. */
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type View = "login" | "register" | "recover";

export interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: () => void;
}

// ── Vista: Iniciar sesión ──

function LoginView({
  onRegister,
  onRecover,
  onSuccess,
}: {
  onRegister: () => void;
  onRecover: () => void;
  onSuccess?: () => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar endpoint de autenticación
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 md:gap-5">
      <div className="flex flex-col gap-1.5 md:gap-2.5">
        <Label htmlFor="login-email" className="md:text-sm">
          Correo electrónico
        </Label>
        <Input
          id="login-email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          required
          className="md:h-10 md:text-sm md:px-3"
        />
      </div>

      <div className="flex flex-col gap-1.5 md:gap-2.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password" className="md:text-sm">
            Contraseña
          </Label>
          <button
            type="button"
            onClick={onRecover}
            className="cursor-pointer text-[0.65rem] leading-none text-[#ff5e00] transition-colors hover:text-[#ff7a2e] md:text-xs"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          className="md:h-10 md:text-sm md:px-3"
        />
      </div>

      <Button
        type="submit"
        className="mt-1 w-full cursor-pointer md:h-10 md:text-sm"
      >
        Entrar
      </Button>

      <p
        className="text-center text-[0.65rem] text-white/50 md:text-xs"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        ¿No tienes cuenta?{" "}
        <button
          type="button"
          onClick={onRegister}
          className="cursor-pointer font-medium text-[#ff5e00] transition-colors hover:text-[#ff7a2e]"
        >
          Regístrate
        </button>
      </p>
    </form>
  );
}

// ── Vista: Registrarse ──

function RegisterView({ onLogin }: { onLogin: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar endpoint de registro
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 md:gap-5">
      <div className="flex flex-col gap-1.5 md:gap-2.5">
        <Label htmlFor="reg-name" className="md:text-sm">
          Nombre
        </Label>
        <Input
          id="reg-name"
          type="text"
          placeholder="Tu nombre"
          autoComplete="name"
          required
          className="md:h-10 md:text-sm md:px-3"
        />
      </div>

      <div className="flex flex-col gap-1.5 md:gap-2.5">
        <Label htmlFor="reg-email" className="md:text-sm">
          Correo electrónico
        </Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          required
          className="md:h-10 md:text-sm md:px-3"
        />
      </div>

      <div className="flex flex-col gap-1.5 md:gap-2.5">
        <Label htmlFor="reg-password" className="md:text-sm">
          Contraseña
        </Label>
        <Input
          id="reg-password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          className="md:h-10 md:text-sm md:px-3"
        />
      </div>

      <div className="flex flex-col gap-1.5 md:gap-2.5">
        <Label htmlFor="reg-confirm" className="md:text-sm">
          Confirmar contraseña
        </Label>
        <Input
          id="reg-confirm"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          className="md:h-10 md:text-sm md:px-3"
        />
      </div>

      <Button
        type="submit"
        className="mt-1 w-full cursor-pointer md:h-10 md:text-sm"
      >
        Crear cuenta
      </Button>

      <p
        className="text-center text-[0.65rem] text-white/50 md:text-xs"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          onClick={onLogin}
          className="cursor-pointer font-medium text-[#ff5e00] transition-colors hover:text-[#ff7a2e]"
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );
}

// ── Vista: Recuperar contraseña ──

function RecoverView({ onLogin }: { onLogin: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar endpoint de recuperación
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 md:gap-5">
      <DialogDescription className="md:text-sm">
        Ingresa tu correo y te enviaremos un enlace para restablecer tu
        contraseña.
      </DialogDescription>

      <div className="flex flex-col gap-1.5 md:gap-2.5">
        <Label htmlFor="recover-email" className="md:text-sm">
          Correo electrónico
        </Label>
        <Input
          id="recover-email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          required
          className="md:h-10 md:text-sm md:px-3"
        />
      </div>

      <Button
        type="submit"
        className="mt-1 w-full cursor-pointer md:h-10 md:text-sm"
      >
        Enviar enlace
      </Button>

      <button
        type="button"
        onClick={onLogin}
        className="mx-auto cursor-pointer text-[0.65rem] text-white/40 transition-colors hover:text-white/70 md:text-xs"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        ← Volver al inicio de sesión
      </button>
    </form>
  );
}

// ── Componente principal ──

export function AuthDialog({ open, onOpenChange, onLoginSuccess }: AuthDialogProps) {
  const [view, setView] = React.useState<View>("login");

  /* Resetea la vista al cerrarse para que siempre abra en "login" */
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setView("login");
    onOpenChange(isOpen);
  };

  const isAuthTab = view === "login" || view === "register";

  const TITLE: Record<View, string> = {
    login: "Iniciar sesión",
    register: "Registrarse",
    recover: "Recuperar contraseña",
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-5 sm:max-w-xs md:max-w-[480px] md:gap-7 md:p-7">
        <DialogHeader className="gap-3 md:gap-5">
          {/* Logo centrado */}
          <a
            href="/"
            className="flex items-center justify-center"
            aria-label="LogicRoutes — inicio"
          >
            <span
              className="text-xl tracking-widest text-white md:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Log<span className="text-[#ff5e00]">Routes</span>
            </span>
          </a>

          {/* DialogTitle (a11y) — oculto visualmente cuando hay tabs */}
          <DialogTitle
            className={cn(
              isAuthTab
                ? "sr-only"
                : "text-center text-sm tracking-wide md:text-xl"
            )}
            style={{
              fontFamily: isAuthTab ? undefined : "var(--font-display)",
            }}
          >
            {TITLE[view]}
          </DialogTitle>

          {/* Tabs login / register */}
          {isAuthTab && (
            <div className="flex rounded-lg bg-white/5 p-0.5">
              <TabButton
                active={view === "login"}
                onClick={() => setView("login")}
              >
                Iniciar sesión
              </TabButton>
              <TabButton
                active={view === "register"}
                onClick={() => setView("register")}
              >
                Registrarse
              </TabButton>
            </div>
          )}
        </DialogHeader>

        {view === "login" && (
          <LoginView
            onRegister={() => setView("register")}
            onRecover={() => setView("recover")}
            onSuccess={onLoginSuccess}
          />
        )}
        {view === "register" && (
          <RegisterView onLogin={() => setView("login")} />
        )}
        {view === "recover" && (
          <RecoverView onLogin={() => setView("login")} />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Tab button interno ──

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 cursor-pointer rounded-md py-1.5 text-[0.65rem] font-semibold transition-all duration-200 md:py-2.5 md:text-sm",
        active
          ? "bg-[#ff5e00] text-white shadow-sm"
          : "text-white/50 hover:text-white/80"
      )}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {children}
    </button>
  );
}
