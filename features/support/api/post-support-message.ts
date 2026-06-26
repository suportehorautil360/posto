import { apiConfig } from "@/shared/config/api";
import {
  getOficinaContextPayload,
  getOficinaRequestHeaders,
} from "@/shared/lib/oficina-context";
import type { SupportChannel, SupportMessage } from "../types/support";

export type PostSupportMessagePayload = {
  channel: SupportChannel;
  text: string;
};

export type PostSupportMessageResponse = {
  data: {
    message: SupportMessage;
    messages: SupportMessage[];
  };
  message: string;
};

export async function postSupportMessage(payload: PostSupportMessagePayload) {
  const { oficinaId } = getOficinaContextPayload();

  const response = await fetch(
    `${apiConfig.baseUrl}/suporte/oficina/${encodeURIComponent(oficinaId)}/mensagens`,
    {
      method: "POST",
      headers: getOficinaRequestHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        ...payload,
        oficinaId,
      }),
    }
  );

  const body = (await response.json().catch(() => null)) as
    | PostSupportMessageResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao enviar mensagem (${response.status})`
    );
  }

  if (!body || !("data" in body) || !body.data?.messages?.length) {
    throw new Error("Resposta inválida ao enviar mensagem de suporte.");
  }

  return body.data.messages;
}
