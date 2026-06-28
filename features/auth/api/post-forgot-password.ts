import { apiConfig } from "@/shared/config/api";

export type ForgotPasswordPayload = {
  email: string;
};

type ApiErrorBody = {
  message?: string | string[];
};

export async function postForgotPassword(
  payload: ForgotPasswordPayload,
): Promise<{ message: string }> {
  const response = await fetch(`${apiConfig.baseUrl}/auth/forgot-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
    }),
  });

  if (!response.ok) {
    let message = "Não foi possível enviar o e-mail.";

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
