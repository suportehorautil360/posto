import { apiConfig } from "@/shared/config/api";
import { getAuthToken } from "../store/auth-store";

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

type ApiErrorBody = {
  message?: string | string[];
};

export async function postChangePassword(
  payload: ChangePasswordPayload,
): Promise<{ message: string }> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const response = await fetch(`${apiConfig.baseUrl}/auth/change-password`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Não foi possível alterar a senha.";

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
