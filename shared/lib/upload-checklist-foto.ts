import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";

type UploadChecklistFotoResponse = {
  data?: {
    url?: string;
  };
  message?: string;
};

type UploadChecklistFotoOptions = {
  checklistId: string;
  nome: string;
};

export async function uploadChecklistFoto(
  file: File,
  { checklistId, nome }: UploadChecklistFotoOptions
): Promise<string> {
  const formData = new FormData();
  formData.append("checklistId", checklistId);
  formData.append("nome", nome);
  formData.append("file", file);

  const response = await fetch(`${apiConfig.baseUrl}/uploads/foto`, {
    method: "POST",
    headers: getOficinaRequestHeaders(),
    body: formData,
  });

  const body = (await response.json().catch(() => null)) as
    | UploadChecklistFotoResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao enviar foto (${response.status})`
    );
  }

  const photoUrl = body && "data" in body ? body.data?.url : undefined;

  if (!photoUrl) {
    throw new Error("Resposta inválida ao enviar foto.");
  }

  return photoUrl;
}
