import type { ServiceOrder } from "../types/service-order";

export const checklistOrderMessages = {
  required: "Selecione uma ordem de serviço.",
  missingQuote:
    "Só é possível registrar CHE ou CHD quando o orçamento desta oficina for aprovado pela prefeitura.",
  emptyList: "Nenhuma OS com orçamento aprovado disponível para checklist.",
  hint: "Somente OS com orçamento aprovado podem receber CHE ou CHD.",
} as const;

export function orderHasOrcamentoAprovado(order: ServiceOrder): boolean {
  if (order.source !== "api") {
    return false;
  }

  return (
    order.resultado?.outcome === "won" || order.status === "aprovada"
  );
}

export function canCreateChecklistForOrder(order: ServiceOrder): boolean {
  return orderHasOrcamentoAprovado(order);
}
