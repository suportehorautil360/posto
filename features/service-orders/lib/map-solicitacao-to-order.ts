import type { SolicitacaoOs } from "../types/solicitacao-os";
import type {
  ServiceOrder,
  ServiceOrderStatus,
  ServiceOrderTab,
} from "../types/service-order";
import { buildPregaoBids } from "./build-pregao-bids";
import {
  buildOrderResultado,
  isResultadoBackendStatus,
  resolveOrderOutcome,
} from "./resolve-order-resultado";

type MapSolicitacaoContext = {
  oficinaId: string;
  oficinaName: string;
};

function formatOpenedAt(value: SolicitacaoOs["criadoEm"]): string {
  if (!value) return "—";

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

  return "—";
}

function formatHorimetro(value: SolicitacaoOs["horimetro"]): string | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  return String(value);
}

function mapBackendStatus(
  solicitacao: SolicitacaoOs,
  context?: MapSolicitacaoContext
): {
  status: ServiceOrderStatus;
  tab: ServiceOrderTab;
} {
  const normalized = solicitacao.status.toLowerCase().replace(/-/g, "_");

  if (
    normalized.includes("aguardando_orcamento") ||
    normalized.includes("recebida") ||
    normalized === "nova"
  ) {
    return { status: "recebida", tab: "recebidas" };
  }

  if (normalized.includes("peca")) {
    return { status: "aguardando-peca", tab: "pregao" };
  }

  if (isResultadoBackendStatus(solicitacao.status)) {
    if (!context) {
      return { status: "nao-selecionada", tab: "resultado" };
    }

    const outcome = resolveOrderOutcome(solicitacao, context.oficinaId);

    return {
      status: outcome === "won" ? "aprovada" : "nao-selecionada",
      tab: "resultado",
    };
  }

  if (
    normalized.includes("andamento") ||
    normalized.includes("orcamento_enviado") ||
    normalized.includes("em_orcamento") ||
    normalized.includes("pregao")
  ) {
    return { status: "em-pregao", tab: "pregao" };
  }

  return { status: "recebida", tab: "recebidas" };
}

export function mapBackendStatusFromString(status: string): {
  status: ServiceOrderStatus;
  tab: ServiceOrderTab;
} {
  return mapBackendStatus({ status, protocolo: "", prefeituraId: "", equipamento: "" });
}

export function mapSolicitacaoToServiceOrder(
  solicitacao: SolicitacaoOs,
  context?: MapSolicitacaoContext
): ServiceOrder {
  const mappedStatus = mapBackendStatus(solicitacao, context);
  const quotedValue =
    typeof solicitacao.valorOrcado === "number" ? solicitacao.valorOrcado : null;
  const userLance =
    context && solicitacao.lances
      ? solicitacao.lances.find((lance) => lance.oficinaId === context.oficinaId)
      : undefined;

  return {
    id: solicitacao.id ?? solicitacao.protocolo,
    code: solicitacao.protocolo,
    client: solicitacao.operador?.trim() || "Prefeitura",
    machine: solicitacao.equipamento,
    openedAt: formatOpenedAt(solicitacao.criadoEm),
    status: mappedStatus.status,
    quotedValue,
    tab: mappedStatus.tab,
    source: "api",
    backendStatus: solicitacao.status,
    relato: solicitacao.relato,
    linha: solicitacao.linha,
    horimetro: formatHorimetro(solicitacao.horimetro),
    prefeituraId: solicitacao.prefeituraId,
    ordemServicoId: userLance?.ordemServicoId,
    pregaoBids:
      mappedStatus.tab === "pregao" && context
        ? buildPregaoBids(
            solicitacao,
            { id: context.oficinaId, name: context.oficinaName },
            quotedValue,
            userLance?.prazoDias ?? null
          )
        : undefined,
    resultado:
      mappedStatus.tab === "resultado" && context
        ? buildOrderResultado(solicitacao, context.oficinaId)
        : undefined,
  };
}

export function mapSolicitacoesToServiceOrders(
  solicitacoes: SolicitacaoOs[],
  context?: MapSolicitacaoContext
): ServiceOrder[] {
  return solicitacoes.map((solicitacao) =>
    mapSolicitacaoToServiceOrder(solicitacao, context)
  );
}
