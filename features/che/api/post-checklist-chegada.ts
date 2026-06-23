import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type {
  ChecklistChegada,
  PostChecklistChegadaPayload,
  PostChecklistChegadaResponse,
} from "../types/checklist-chegada-api";

export async function postChecklistChegada(
  payload: PostChecklistChegadaPayload
): Promise<ChecklistChegada> {
  const response = await fetch(`${apiConfig.baseUrl}/checklist-chegada`, {
    method: "POST",
    headers: getOficinaRequestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => null)) as
    | PostChecklistChegadaResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao salvar checklist de chegada (${response.status})`
    );
  }

  if (!body || !("data" in body) || !body.data) {
    throw new Error("Resposta inválida ao salvar checklist de chegada.");
  }

  return body.data;
}
