import { apiConfig } from "@/shared/config/api";

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

type ApiErrorBody = {
  message?: string | string[];
};

export async function postResetPassword(
  payload: ResetPasswordPayload,
): Promise<{ message: string }> {
  const response = await fetch(`${apiConfig.baseUrl}/auth/reset-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Não foi possível redefinir a senha.";

    try {
      const body = (await response.json()) as ApiErrorBody;
      const raw = body.message;

      if (typeof raw === "string" && raw.trim()) {
        message = raw;
      } else if (Array.isArray(raw) && typeof raw[0] === "string") {
        message = raw[0];
      }
    } catch {
      // mantém mensagem padrão
    }

    throw new Error(message);
  }

  return (await response.json()) as { message: string };
}
