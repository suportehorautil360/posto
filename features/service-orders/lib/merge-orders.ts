import type { ServiceOrder } from "../types/service-order";

export function mergeServiceOrders(
  apiOrders: ServiceOrder[],
  localOrders: ServiceOrder[]
) {
  const apiIds = new Set(apiOrders.map((order) => order.id));

  const localOnly = localOrders.filter(
    (order) => order.source === "local" && !apiIds.has(order.id)
  );

  return [...apiOrders, ...localOnly];
}
