import { buildPregaoBids } from "./build-pregao-bids";
import type { SolicitacaoOs } from "../types/solicitacao-os";
import type { ServiceOrder } from "../types/service-order";

type OficinaRef = {
  id: string;
  name: string;
};

export function promoteOrderToPregao(
  order: ServiceOrder,
  oficina: OficinaRef,
  quotedValue: number
): Partial<ServiceOrder> {
  const solicitacaoStub: SolicitacaoOs = {
    protocolo: order.code,
    prefeituraId: order.prefeituraId ?? "",
    equipamento: order.machine,
    status: "em_pregao",
    valorOrcado: quotedValue,
    relato: order.relato,
    linha: order.linha,
  };

  return {
    tab: "pregao",
    status: "em-pregao",
    quotedValue,
    pregaoBids: buildPregaoBids(solicitacaoStub, oficina, quotedValue),
  };
}

export function shouldPromoteToPregao(
  order: ServiceOrder,
  quotedValue: number
): boolean {
  return order.tab === "recebidas" && quotedValue > 0;
}
