import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import type {
  SolicitacaoOs,
  SolicitacoesOficinaResponse,
} from "../types/solicitacao-os";

export async function getSolicitacoesOficina(
  oficinaId: string
): Promise<SolicitacaoOs[]> {
  const response = await fetch(
    `${apiConfig.baseUrl}/os/solicitacoes/oficina/${oficinaId}`,
    {
      method: "GET",
      headers: getOficinaRequestHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(`Erro ao carregar OS da oficina (${response.status})`);
  }

  const payload = (await response.json()) as SolicitacoesOficinaResponse;

  return payload.data ?? [];
}
