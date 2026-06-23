import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type {
  PostOrcamentoPayload,
  PostOrcamentoResponse,
} from "../types/orcamento-api";

export async function postOrcamento(payload: PostOrcamentoPayload) {
  const response = await fetch(`${apiConfig.baseUrl}/os/orcamentos`, {
    method: "POST",
    headers: getOficinaRequestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => null)) as
    | PostOrcamentoResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao enviar orçamento (${response.status})`
    );
  }

  if (!body || !("data" in body) || !body.data) {
    throw new Error("Resposta inválida ao enviar orçamento.");
  }

  return body.data;
}
