import type { SolicitacaoOs } from "../types/solicitacao-os";
import type {
  ServiceOrderOutcome,
  ServiceOrderResultado,
} from "../types/order-resultado";

function formatApprovedAt(value: SolicitacaoOs["aprovadoEm"]): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("pt-BR");
    }

    return value;
  }

  if (typeof value === "object" && "_seconds" in value) {
    return new Date(value._seconds * 1000).toLocaleDateString("pt-BR");
  }

  return null;
}

function isRejectedStatus(normalized: string) {
  return (
    normalized.includes("rejeit") ||
    normalized.includes("nao_selecion") ||
    normalized.includes("recusad")
  );
}

function isResultadoStatus(normalized: string) {
  return (
    normalized.includes("aprovado") ||
    normalized.includes("encerrad") ||
    normalized.includes("finaliz") ||
    normalized.includes("concluid") ||
    normalized.includes("cancelad") ||
    isRejectedStatus(normalized)
  );
}

export function isResultadoBackendStatus(status: string) {
  const normalized = status.toLowerCase().replace(/-/g, "_");

  return isResultadoStatus(normalized);
}

export function resolveOrderOutcome(
  solicitacao: SolicitacaoOs,
  currentOficinaId: string
): ServiceOrderOutcome {
  const normalized = solicitacao.status.toLowerCase().replace(/-/g, "_");

  if (isRejectedStatus(normalized)) {
    return "rejected";
  }

  if (solicitacao.oficinaVencedoraId) {
    return solicitacao.oficinaVencedoraId === currentOficinaId ? "won" : "lost";
  }

  if (normalized.includes("aprovado")) {
    return typeof solicitacao.valorOrcado === "number" ? "won" : "lost";
  }

  return "lost";
}

export function buildOrderResultado(
  solicitacao: SolicitacaoOs,
  currentOficinaId: string
): ServiceOrderResultado {
  const yourBidValue =
    typeof solicitacao.valorOrcado === "number" ? solicitacao.valorOrcado : null;
  const approvedValue =
    typeof solicitacao.valorAprovado === "number"
      ? solicitacao.valorAprovado
      : yourBidValue;

  return {
    outcome: resolveOrderOutcome(solicitacao, currentOficinaId),
    approvedValue,
    approvedAt: formatApprovedAt(solicitacao.aprovadoEm),
    yourBidValue,
  };
}
