import { apiConfig } from "@/shared/config/api";
import type { Oficina, OficinasResponse } from "../types/oficina";

export async function getOficinas(): Promise<Oficina[]> {
  const response = await fetch(`${apiConfig.baseUrl}/oficinas`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao carregar oficinas (${response.status})`);
  }

  const payload = (await response.json()) as OficinasResponse;

  return payload.data ?? [];
}

export function getActiveOficinas(oficinas: Oficina[]) {
  return oficinas.filter((oficina) => oficina.ativo);
}
