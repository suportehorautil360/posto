import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import { getSolicitacoesOficina } from "./get-solicitacoes-oficina";
import { mapSolicitacoesToOrcamentos } from "../lib/map-solicitacoes-to-orcamentos";
import type {
  Orcamento,
  OrcamentosListResponse,
} from "../types/orcamento-api";

export async function getOrcamentosOficina(
  oficinaId: string
): Promise<Orcamento[]> {
  const response = await fetch(
    `${apiConfig.baseUrl}/os/orcamentos/oficina/${oficinaId}`,
    {
      method: "GET",
      headers: getOficinaRequestHeaders(),
    }
  );

  if (response.ok) {
    const body = (await response.json().catch(() => null)) as
      | OrcamentosListResponse
      | { message?: string }
      | null;

    if (body && "data" in body && Array.isArray(body.data)) {
      return body.data;
    }
  }

  const solicitacoes = await getSolicitacoesOficina(oficinaId);

  return mapSolicitacoesToOrcamentos(solicitacoes, oficinaId);
}
