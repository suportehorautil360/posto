import { serviceOrders } from "../data/service-orders";

export function getNextOrderCode() {
  const maxNumber = serviceOrders.reduce((max, order) => {
    const match = order.code.match(/OS-(\d+)/);

    if (!match) return max;

    return Math.max(max, Number.parseInt(match[1], 10));
  }, 0);

  return `OS-${String(maxNumber + 1).padStart(4, "0")}`;
}

export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}
