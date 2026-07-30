"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postForgotPassword } from "../api/post-forgot-password";
import { forgotPasswordConfig } from "../config/forgot-password";
import { getRememberedEmail, rememberEmail } from "../lib/remember-email";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) {
      setEmail(remembered);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      rememberEmail(normalizedEmail);
      const result = await postForgotPassword({ email: normalizedEmail });
      setSuccess(result.message || forgotPasswordConfig.successMessage);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : forgotPasswordConfig.genericError,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="forgot-email"
          className="text-sm font-semibold text-zinc-800"
        >
          {forgotPasswordConfig.emailLabel}
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400"
            aria-hidden
          />
          <Input
            id="forgot-email"
            type="email"
            placeholder={forgotPasswordConfig.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            disabled={isSubmitting || Boolean(success)}
            required
            className="h-11 rounded-lg border-zinc-200 bg-white pr-3.5 pl-10 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus-visible:border-orange-500 focus-visible:ring-orange-500/20"
          />
        </div>
      </div>

      {error ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {success ? (
        <p
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
          role="status"
        >
          {success}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting || !email.trim() || Boolean(success)}
        className="h-11 rounded-lg bg-orange-600 text-[15px] font-semibold text-white hover:bg-orange-700"
      >
        {isSubmitting ? (
          forgotPasswordConfig.loadingLabel
        ) : (
          <span className="inline-flex items-center gap-2">
            {forgotPasswordConfig.submitLabel}
            <ArrowRight className="size-4 opacity-90" aria-hidden />
          </span>
        )}
      </Button>

      <p className="text-center text-sm text-zinc-500">
        Lembrou a senha?{" "}
        <Link
          href="/login"
          className="font-semibold text-orange-600 underline-offset-4 hover:text-orange-700 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
