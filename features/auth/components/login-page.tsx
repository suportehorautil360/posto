import { Lock, ShieldCheck, Wrench } from "lucide-react";
import { AuthBrandPanel } from "./auth-brand-panel";
import { LoginForm } from "./login-form";
import { loginConfig } from "../config/login";

export function LoginPage() {
  return (
    <div className="flex min-h-svh bg-white">
      <AuthBrandPanel />

      <main className="flex min-h-svh flex-1 flex-col justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-[420px] animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Wrench className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                {loginConfig.brand}
              </p>
              <p className="text-xs text-zinc-500">{loginConfig.portalLabel}</p>
            </div>
          </div>

          <div className="mb-8">
            <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
              <Lock className="size-5" aria-hidden />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-[1.75rem]">
              {loginConfig.title}
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
              {loginConfig.subtitle}
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 flex gap-3 rounded-xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-sm text-sky-900/80">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-sky-600"
              aria-hidden
            />
            <p>
              Acesso seguro: use apenas as credenciais da oficina credenciada.
              Em caso de SSO ou bloqueio, fale com o administrador da operação.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
