import type { ServiceOrder } from "../types/service-order";

export function getOrdersByTab(
  orders: ServiceOrder[],
  tab: ServiceOrder["tab"]
) {
  return orders.filter((order) => order.tab === tab);
}

export function getTabCounts(orders: ServiceOrder[]) {
  return {
    recebidas: getOrdersByTab(orders, "recebidas").length,
    pregao: getOrdersByTab(orders, "pregao").length,
    resultado: getOrdersByTab(orders, "resultado").length,
  };
}
