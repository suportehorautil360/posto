import type { ServiceOrder } from "@/features/service-orders/types/service-order";

export function getCheSaveOrderLinks(order?: ServiceOrder) {
  if (!order || order.source !== "api") {
    return {};
  }

  return {
    solicitacaoOsId: order.id,
  };
}
