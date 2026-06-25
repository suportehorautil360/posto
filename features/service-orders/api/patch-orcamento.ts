import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type {
  PatchOrcamentoPayload,
  PostOrcamentoData,
  PostOrcamentoResponse,
} from "../types/orcamento-api";

export async function patchOrcamento(
  orcamentoId: string,
  payload: PatchOrcamentoPayload
) {
  const response = await fetch(
    `${apiConfig.baseUrl}/os/orcamentos/${encodeURIComponent(orcamentoId)}`,
    {
      method: "PATCH",
      headers: getOficinaRequestHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    }
  );

  const body = (await response.json().catch(() => null)) as
    | PostOrcamentoResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao atualizar orçamento (${response.status})`
    );
  }

  if (!body || !("data" in body) || !body.data) {
    throw new Error("Resposta inválida ao atualizar orçamento.");
  }

  return body.data as PostOrcamentoData;
}
