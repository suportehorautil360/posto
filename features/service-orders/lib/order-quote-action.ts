import { serviceOrdersPageConfig } from "../config/page";
import type { ServiceOrder } from "../types/service-order";

export function hasSubmittedQuote(order: ServiceOrder): boolean {
  return order.quotedValue !== null && order.quotedValue > 0;
}

export function canCreateQuoteForOrder(order: ServiceOrder): boolean {
  if (order.source !== "api") {
    return false;
  }

  const outcome = order.resultado?.outcome;

  if (outcome === "lost" || outcome === "rejected") {
    return false;
  }

  return !hasSubmittedQuote(order);
}

export function getQuoteActionLabel(order: ServiceOrder): string {
  return serviceOrdersPageConfig.actions.buildQuote;
}

export function getQuoteActionUrl(order: ServiceOrder): string {
  return `/orcamentos/novo?orderId=${order.id}`;
}
