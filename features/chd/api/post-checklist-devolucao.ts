import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type {
  ChecklistDevolucao,
  PostChecklistDevolucaoPayload,
  PostChecklistDevolucaoResponse,
} from "../types/checklist-devolucao-api";

export async function postChecklistDevolucao(
  payload: PostChecklistDevolucaoPayload
): Promise<ChecklistDevolucao> {
  const response = await fetch(`${apiConfig.baseUrl}/checklist-devolucao`, {
    method: "POST",
    headers: getOficinaRequestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => null)) as
    | PostChecklistDevolucaoResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao salvar checklist de devolução (${response.status})`
    );
  }

  if (!body || !("data" in body) || !body.data) {
    throw new Error("Resposta inválida ao salvar checklist de devolução.");
  }

  return body.data;
}
