import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type {
  ChecklistChegada,
  PatchChecklistChegadaFotosPayload,
  PatchChecklistChegadaFotosResponse,
} from "../types/checklist-chegada-api";

export async function patchChecklistChegadaFotos(
  checklistId: string,
  payload: PatchChecklistChegadaFotosPayload
): Promise<ChecklistChegada> {
  const response = await fetch(
    `${apiConfig.baseUrl}/checklist-chegada/${checklistId}/fotos`,
    {
      method: "PATCH",
      headers: getOficinaRequestHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    }
  );

  const body = (await response.json().catch(() => null)) as
    | PatchChecklistChegadaFotosResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao salvar fotos do checklist (${response.status})`
    );
  }

  if (!body || !("data" in body) || !body.data) {
    throw new Error("Resposta inválida ao salvar fotos do checklist.");
  }

  return body.data;
}
