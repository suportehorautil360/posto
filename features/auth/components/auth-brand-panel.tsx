import { loginConfig } from "../config/login";
import { LoginLogo } from "./login-logo";

type AuthBrandPanelProps = {
  eyebrow?: string;
};

export function AuthBrandPanel({
  eyebrow = "Uma plataforma Hora Útil",
}: AuthBrandPanelProps) {
  return (
    <aside className="of-auth-brand relative hidden min-h-svh flex-col justify-between overflow-hidden px-10 py-10 text-white lg:flex lg:w-[46%] xl:px-14">
      <div className="of-auth-brand-grid" aria-hidden />

      <p className="relative z-10 text-[11px] font-medium tracking-[0.18em] text-white/55 uppercase">
        {eyebrow}
      </p>

      <div className="relative z-10 max-w-md">
        <div className="flex items-center gap-4">
          <LoginLogo
            size={48}
            className="shadow-[0_12px_28px_-10px_rgba(249,115,22,0.75)]"
          />
          <div className="border-l border-white/20 pl-4">
            <p className="text-lg font-semibold tracking-tight text-white">
              {loginConfig.brand}
            </p>
            <p className="text-sm text-white/60">{loginConfig.portalLabel}</p>
          </div>
        </div>

        <h2 className="mt-10 text-4xl leading-[1.1] font-semibold tracking-tight text-white xl:text-[2.75rem]">
          {loginConfig.heroTitle}{" "}
          <span className="text-orange-300">{loginConfig.heroHighlight}</span>
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-white/65">
          {loginConfig.heroDescription}
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/50 backdrop-blur-sm">
        <span className="font-medium text-white/70">Portal credenciado</span>
        <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
        <span>© {new Date().getFullYear()} Hora Útil</span>
        <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
        <span>{loginConfig.secureNote}</span>
      </div>
    </aside>
  );
}
