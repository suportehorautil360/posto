import type { Orcamento } from "../types/orcamento-api";
import type { SolicitacaoOs } from "../types/solicitacao-os";

function formatCreatedAt(value: SolicitacaoOs["criadoEm"]): string | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && "_seconds" in value) {
    return new Date(value._seconds * 1000).toISOString();
  }

  return undefined;
}

export function mapSolicitacoesToOrcamentos(
  solicitacoes: SolicitacaoOs[],
  oficinaId: string
): Orcamento[] {
  const orcamentos: Orcamento[] = [];

  for (const solicitacao of solicitacoes) {
    const lance = solicitacao.lances?.find(
      (entry) => entry.oficinaId === oficinaId
    );

    if (!lance || typeof lance.valor !== "number") {
      continue;
    }

    const solicitacaoOsId = solicitacao.id ?? solicitacao.protocolo;
    const ordemServicoId = lance.ordemServicoId?.trim();

    orcamentos.push({
      id: ordemServicoId || solicitacaoOsId,
      protocol: solicitacao.protocolo,
      solicitacaoOsId,
      oficinaId,
      valorTotal: lance.valor,
      prazoDias: typeof lance.prazoDias === "number" ? lance.prazoDias : 0,
      items: [],
      equipamento: solicitacao.equipamento,
      operador: solicitacao.operador,
      solicitacaoStatus: solicitacao.status,
      createdAt: formatCreatedAt(solicitacao.criadoEm),
    });
  }

  return orcamentos;
}
