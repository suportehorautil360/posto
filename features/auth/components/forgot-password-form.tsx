"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/shared/ui/text-field";
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
      <TextField
        label={forgotPasswordConfig.emailLabel}
        type="email"
        placeholder={forgotPasswordConfig.emailPlaceholder}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        disabled={isSubmitting || Boolean(success)}
        required
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

      <Button
        type="submit"
        disabled={isSubmitting || !email.trim() || Boolean(success)}
        className="h-11 bg-brand-orange text-white hover:bg-brand-orange-hover"
      >
        {isSubmitting
          ? forgotPasswordConfig.loadingLabel
          : forgotPasswordConfig.submitLabel}
      </Button>

      <Link
        href="/login"
        className="text-center text-sm font-medium text-brand-navy hover:underline"
      >
        {forgotPasswordConfig.backToLogin}
      </Link>
    </form>
  );
}
