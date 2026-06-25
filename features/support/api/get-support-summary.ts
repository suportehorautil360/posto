import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type { SupportChannel } from "../types/support";

export type SupportSummary = {
  unreadCount: number;
  channels: Record<
    SupportChannel,
    {
      unreadCount: number;
      lastMessageAt: string | null;
    }
  >;
  online: boolean;
};

export type SupportSummaryResponse = {
  data: SupportSummary;
  message: string;
};

export async function getSupportSummary(oficinaId: string) {
  const response = await fetch(
    `${apiConfig.baseUrl}/suporte/oficina/${encodeURIComponent(oficinaId)}/resumo`,
    {
      headers: getOficinaRequestHeaders(),
      cache: "no-store",
    }
  );

  const body = (await response.json().catch(() => null)) as
    | SupportSummaryResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao carregar resumo de suporte (${response.status})`
    );
  }

  if (!body || !("data" in body) || !body.data) {
    throw new Error("Resposta inválida ao carregar resumo de suporte.");
  }

  return body.data;
}
