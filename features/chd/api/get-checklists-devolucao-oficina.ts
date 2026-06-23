import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type {
  ChecklistDevolucao,
  ChecklistsDevolucaoListResponse,
} from "../types/checklist-devolucao-api";

export async function getChecklistsDevolucaoOficina(
  oficinaId: string
): Promise<ChecklistDevolucao[]> {
  const response = await fetch(
    `${apiConfig.baseUrl}/checklist-devolucao/oficina/${oficinaId}`,
    {
      method: "GET",
      headers: getOficinaRequestHeaders(),
    }
  );

  const body = (await response.json().catch(() => null)) as
    | ChecklistsDevolucaoListResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao carregar checklists de devolução (${response.status})`
    );
  }

  if (!body || !("data" in body)) {
    throw new Error("Resposta inválida ao carregar checklists de devolução.");
  }

  return body.data ?? [];
}
