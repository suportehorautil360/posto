import { apiConfig } from "@/shared/config/api";
import {
  appendOficinaContext,
  getOficinaContextPayload,
  getOficinaRequestHeaders,
} from "@/shared/lib/oficina-context";
import { mapInvoiceUploadError } from "../lib/map-invoice-upload-error";
import type { Invoice } from "../types/invoice";
export type PostNotaFiscalResponse = {
  data: Invoice;
  message: string;
};

export async function postNotaFiscal(file: File) {
  const { oficinaId } = getOficinaContextPayload();
  const formData = new FormData();
  formData.append("file", file);
  appendOficinaContext(formData);

  const response = await fetch(
    `${apiConfig.baseUrl}/notas-fiscais/oficina/${encodeURIComponent(oficinaId)}`,
    {
      method: "POST",
      headers: getOficinaRequestHeaders(),
      body: formData,
    }
  );

  const body = (await response.json().catch(() => null)) as
    | PostNotaFiscalResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    const rawMessage =
      body && "message" in body && body.message
        ? body.message
        : `Erro ao enviar nota fiscal (${response.status})`;

    throw new Error(mapInvoiceUploadError(rawMessage));
  }
  if (!body || !("data" in body) || !body.data) {
    throw new Error("Resposta inválida ao enviar nota fiscal.");
  }

  return body.data;
}
