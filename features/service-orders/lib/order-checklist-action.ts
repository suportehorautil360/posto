import { hasSubmittedQuote } from "./order-quote-action";
import type { ServiceOrder } from "../types/service-order";

export const checklistOrderMessages = {
  required: "Selecione uma ordem de serviço.",
  missingQuote:
    "Só é possível registrar CHE ou CHD quando a OS tiver orçamento enviado pela oficina.",
  emptyList: "Nenhuma OS com orçamento disponível para checklist.",
  hint: "Somente OS com orçamento enviado podem receber CHE ou CHD.",
} as const;

export function orderHasOrcamento(order: ServiceOrder): boolean {
  if (order.source !== "api") {
    return false;
  }

  if (hasSubmittedQuote(order)) {
    return true;
  }

  return Boolean(order.ordemServicoId?.trim());
}

export function canCreateChecklistForOrder(order: ServiceOrder): boolean {
  if (order.source !== "api") {
    return false;
  }

  const outcome = order.resultado?.outcome;

  if (outcome === "lost" || outcome === "rejected") {
    return false;
  }

  return orderHasOrcamento(order);
}
