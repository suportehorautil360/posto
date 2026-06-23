import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type {
  ChecklistDevolucao,
  PatchChecklistDevolucaoFotosPayload,
  PostChecklistDevolucaoResponse,
} from "../types/checklist-devolucao-api";

export async function patchChecklistDevolucaoFotos(
  checklistId: string,
  payload: PatchChecklistDevolucaoFotosPayload
): Promise<ChecklistDevolucao> {
  const response = await fetch(
    `${apiConfig.baseUrl}/checklist-devolucao/${checklistId}/fotos`,
    {
      method: "PATCH",
      headers: getOficinaRequestHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
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
        : `Erro ao salvar fotos do checklist de devolução (${response.status})`
    );
  }

  if (!body || !("data" in body) || !body.data) {
    throw new Error("Resposta inválida ao salvar fotos do checklist de devolução.");
  }

  return body.data;
}
