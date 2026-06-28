"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPasswordConfig } from "../config/reset-password";
import { LoginLogo } from "./login-logo";
import { ResetPasswordForm } from "./reset-password-form";

export function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-brand-navy px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-xl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <LoginLogo />
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-brand-navy">
              {resetPasswordConfig.title}
            </h1>
            <p className="text-sm text-zinc-500">{resetPasswordConfig.subtitle}</p>
          </div>
        </div>

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm text-red-600">{resetPasswordConfig.invalidLink}</p>
            <Link
              href="/esqueci-senha"
              className="text-sm font-medium text-brand-navy hover:underline"
            >
              {resetPasswordConfig.requestNewLink}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
