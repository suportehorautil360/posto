"use client";

import { changePasswordConfig } from "../config/change-password";
import { ChangePasswordForm } from "./change-password-form";
import { LoginLogo } from "./login-logo";

type ChangePasswordModalProps = {
  open: boolean;
};

export function ChangePasswordModal({ open }: ChangePasswordModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
    >
      <div
        className="absolute inset-0 bg-brand-navy/50 backdrop-blur-md"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-2xl ring-1 ring-white/20">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <LoginLogo />
          <div className="space-y-1">
            <h2
              id="change-password-title"
              className="text-xl font-bold tracking-tight text-brand-navy"
            >
              {changePasswordConfig.title}
            </h2>
            <p className="text-sm text-zinc-500">{changePasswordConfig.subtitle}</p>
          </div>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
