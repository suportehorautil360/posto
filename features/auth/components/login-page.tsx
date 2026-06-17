import { loginConfig } from "../config/login";
import { LoginForm } from "./login-form";
import { LoginLogo } from "./login-logo";

export function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-brand-navy px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-xl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <LoginLogo />
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-brand-navy">
              {loginConfig.title}
            </h1>
            <p className="text-sm text-zinc-500">{loginConfig.subtitle}</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
