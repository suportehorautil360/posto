import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type {
  ChecklistDevolucao,
  PostChecklistDevolucaoResponse,
} from "../types/checklist-devolucao-api";

export async function getChecklistDevolucaoById(
  id: string
): Promise<ChecklistDevolucao> {
  const response = await fetch(
    `${apiConfig.baseUrl}/checklist-devolucao/${id}`,
    {
      method: "GET",
      headers: getOficinaRequestHeaders(),
    }
  );

  const body = (await response.json().catch(() => null)) as
    | PostChecklistDevolucaoResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao carregar checklist de devolução (${response.status})`
    );
  }

  if (!body || !("data" in body) || !body.data) {
    throw new Error("Resposta inválida ao carregar checklist de devolução.");
  }

  return body.data;
}
