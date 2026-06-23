import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type {
  ChecklistChegada,
  PostChecklistChegadaResponse,
} from "../types/checklist-chegada-api";

export async function getChecklistChegadaById(
  id: string
): Promise<ChecklistChegada> {
  const response = await fetch(`${apiConfig.baseUrl}/checklist-chegada/${id}`, {
    method: "GET",
    headers: getOficinaRequestHeaders(),
  });

  const body = (await response.json().catch(() => null)) as
    | PostChecklistChegadaResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao carregar checklist de chegada (${response.status})`
    );
  }

  if (!body || !("data" in body) || !body.data) {
    throw new Error("Resposta inválida ao carregar checklist de chegada.");
  }

  return body.data;
}
