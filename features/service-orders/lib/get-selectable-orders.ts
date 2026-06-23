import type { ServiceOrder } from "../types/service-order";

const NONE_VALUE = "__none__";

export function isSelectableServiceOrder(order: ServiceOrder) {
  if (order.source !== "api") {
    return false;
  }

  const outcome = order.resultado?.outcome;

  return outcome !== "lost" && outcome !== "rejected";
}

export function getSelectableServiceOrders(orders: ServiceOrder[]) {
  return orders.filter(isSelectableServiceOrder).sort((left, right) => {
    return right.code.localeCompare(left.code, "pt-BR", {
      numeric: true,
      sensitivity: "base",
    });
  });
}

export function formatServiceOrderOptionLabel(order: ServiceOrder) {
  return `${order.code} · ${order.machine} · ${order.client}`;
}

export function getServiceOrderDisplayName(order: ServiceOrder) {
  return order.code;
}

export function findServiceOrderById(orders: ServiceOrder[], orderId: string) {
  return orders.find((order) => order.id === orderId);
}

export { NONE_VALUE as serviceOrderSelectNoneValue };
