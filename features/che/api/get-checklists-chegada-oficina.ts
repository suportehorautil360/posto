import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type {
  ChecklistChegada,
  ChecklistsChegadaListResponse,
} from "../types/checklist-chegada-api";

export async function getChecklistsChegadaOficina(
  oficinaId: string
): Promise<ChecklistChegada[]> {
  const response = await fetch(
    `${apiConfig.baseUrl}/checklist-chegada/oficina/${oficinaId}`,
    {
      method: "GET",
      headers: getOficinaRequestHeaders(),
    }
  );

  const body = (await response.json().catch(() => null)) as
    | ChecklistsChegadaListResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao carregar checklists de chegada (${response.status})`
    );
  }

  if (!body || !("data" in body)) {
    throw new Error("Resposta inválida ao carregar checklists de chegada.");
  }

  return body.data ?? [];
}
