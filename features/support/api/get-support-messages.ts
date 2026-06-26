import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type { SupportChannel, SupportMessage } from "../types/support";

export type SupportMessagesResponse = {
  data: {
    channel: SupportChannel;
    messages: SupportMessage[];
  };
  message: string;
};

export async function getSupportMessages(
  oficinaId: string,
  channel: SupportChannel,
  options?: { limit?: number; before?: string }
) {
  const params = new URLSearchParams({ channel });

  if (options?.limit) {
    params.set("limit", String(options.limit));
  }

  if (options?.before) {
    params.set("before", options.before);
  }

  const response = await fetch(
    `${apiConfig.baseUrl}/suporte/oficina/${encodeURIComponent(oficinaId)}/mensagens?${params.toString()}`,
    {
      headers: getOficinaRequestHeaders(),
      cache: "no-store",
    }
  );

  const body = (await response.json().catch(() => null)) as
    | SupportMessagesResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao carregar mensagens (${response.status})`
    );
  }

  if (!body || !("data" in body) || !Array.isArray(body.data?.messages)) {
    throw new Error("Resposta inválida ao carregar mensagens de suporte.");
  }

  return body.data.messages;
}
