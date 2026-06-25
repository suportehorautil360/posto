import { apiConfig } from "@/shared/config/api";
import { getOficinaRequestHeaders } from "@/shared/lib/oficina-context";
import { normalizeOrcamento } from "../lib/normalize-orcamento";
import { getOrcamentosOficina } from "./get-orcamentos-oficina";
import type { Orcamento, OrcamentoResponse } from "../types/orcamento-api";

export async function getOrcamentoById(
  id: string,
  oficinaId?: string
): Promise<Orcamento> {
  const query = oficinaId
    ? `?oficinaId=${encodeURIComponent(oficinaId)}`
    : "";

  const response = await fetch(
    `${apiConfig.baseUrl}/os/orcamentos/${id}${query}`,
    {
      method: "GET",
      headers: getOficinaRequestHeaders(),
    }
  );

  if (response.ok) {
    const body = (await response.json().catch(() => null)) as
      | OrcamentoResponse
      | { message?: string; data?: unknown }
      | null;

    if (body && "data" in body && body.data) {
      const normalized = normalizeOrcamento(body.data);

      if (normalized) {
        return normalized;
      }
    }
  }

  if (!oficinaId) {
    throw new Error(
      response.status === 404
        ? "Orçamento não encontrado."
        : `Erro ao carregar orçamento (${response.status})`
    );
  }

  const orcamentos = await getOrcamentosOficina(oficinaId);
  const orcamento = orcamentos.find(
    (entry) => entry.id === id || entry.solicitacaoOsId === id
  );

  if (!orcamento) {
    throw new Error("Orçamento não encontrado.");
  }

  return orcamento;
}
