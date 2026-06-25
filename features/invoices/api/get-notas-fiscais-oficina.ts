import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type { Invoice } from "../types/invoice";

export type NotasFiscaisListResponse = {
  data: Invoice[];
  message: string;
};

export async function getNotasFiscaisOficina(oficinaId: string) {
  const response = await fetch(
    `${apiConfig.baseUrl}/notas-fiscais/oficina/${encodeURIComponent(oficinaId)}`,
    {
      headers: getOficinaRequestHeaders(),
      cache: "no-store",
    }
  );

  const body = (await response.json().catch(() => null)) as
    | NotasFiscaisListResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      body && "message" in body && body.message
        ? body.message
        : `Erro ao carregar notas fiscais (${response.status})`
    );
  }

  if (!body || !("data" in body) || !Array.isArray(body.data)) {
    throw new Error("Resposta inválida ao carregar notas fiscais.");
  }

  return [...body.data].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}
