"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/shared/ui/password-field";
import { postResetPassword } from "../api/post-reset-password";
import { resetPasswordConfig } from "../config/reset-password";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError(resetPasswordConfig.minLengthError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(resetPasswordConfig.mismatchError);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await postResetPassword({ token, newPassword });
      setSuccess(result.message || resetPasswordConfig.successMessage);
      setTimeout(() => router.replace("/login"), 2000);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : resetPasswordConfig.genericError,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <PasswordField
        label={resetPasswordConfig.newPasswordLabel}
        placeholder={resetPasswordConfig.newPasswordPlaceholder}
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        autoComplete="new-password"
        disabled={isSubmitting || Boolean(success)}
        required
      />

      <PasswordField
        label={resetPasswordConfig.confirmPasswordLabel}
        placeholder={resetPasswordConfig.confirmPasswordPlaceholder}
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        autoComplete="new-password"
        disabled={isSubmitting || Boolean(success)}
        required
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

      <Button
        type="submit"
        disabled={
          isSubmitting || !newPassword || !confirmPassword || Boolean(success)
        }
        className="h-11 bg-brand-orange text-white hover:bg-brand-orange-hover"
      >
        {isSubmitting
          ? resetPasswordConfig.loadingLabel
          : resetPasswordConfig.submitLabel}
      </Button>

      <Link
        href="/login"
        className="text-center text-sm font-medium text-brand-navy hover:underline"
      >
        {resetPasswordConfig.backToLogin}
      </Link>
    </form>
  );
}
