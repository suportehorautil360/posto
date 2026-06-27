import { apiConfig } from "@/shared/config/api";
import type { Oficina } from "../types/oficina";
import type { AuthUser } from "../store/auth-store";

export type LoginPayload = {
  usuario: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
  oficina?: Oficina;
};

type ApiErrorBody = {
  message?: string | string[];
};

export async function postLogin(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${apiConfig.baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario: payload.usuario.trim(),
      password: payload.password,
    }),
  });

  if (!response.ok) {
    let message = "Usuário ou senha inválidos.";

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

  return (await response.json()) as LoginResponse;
}
