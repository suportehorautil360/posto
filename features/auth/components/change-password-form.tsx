"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/shared/ui/password-field";
import { postChangePassword } from "../api/post-change-password";
import { changePasswordConfig } from "../config/change-password";
import { useAuthStore } from "../store/auth-store";

export function ChangePasswordForm() {
  const clearMustChangePassword = useAuthStore(
    (state) => state.clearMustChangePassword,
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError(changePasswordConfig.minLengthError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(changePasswordConfig.mismatchError);
      return;
    }

    setIsSubmitting(true);

    try {
      await postChangePassword({ currentPassword, newPassword });
      clearMustChangePassword();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : changePasswordConfig.genericError,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <PasswordField
        label={changePasswordConfig.currentPasswordLabel}
        placeholder={changePasswordConfig.currentPasswordPlaceholder}
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
        autoComplete="current-password"
        disabled={isSubmitting}
        required
      />

      <PasswordField
        label={changePasswordConfig.newPasswordLabel}
        placeholder={changePasswordConfig.newPasswordPlaceholder}
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        autoComplete="new-password"
        disabled={isSubmitting}
        required
      />

      <PasswordField
        label={changePasswordConfig.confirmPasswordLabel}
        placeholder={changePasswordConfig.confirmPasswordPlaceholder}
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        autoComplete="new-password"
        disabled={isSubmitting}
        required
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button
        type="submit"
        disabled={
          isSubmitting ||
          !currentPassword ||
          !newPassword ||
          !confirmPassword
        }
        className="h-11 bg-brand-orange text-white hover:bg-brand-orange-hover"
      >
        {isSubmitting
          ? changePasswordConfig.loadingLabel
          : changePasswordConfig.submitLabel}
      </Button>
    </form>
  );
}
