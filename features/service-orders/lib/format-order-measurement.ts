import type { ServiceOrder } from "../types/service-order";

export function formatOrderMeasurement(order: ServiceOrder): string | undefined {
  if (order.hourMeter?.trim()) {
    return `${order.hourMeter.trim()} h`;
  }

  if (order.currentKm?.trim()) {
    return `${order.currentKm.trim()} km`;
  }

  if (order.horimetro?.trim()) {
    return order.horimetro.trim();
  }

  if (order.km?.trim()) {
    return `${order.km.trim()} km`;
  }

  return undefined;
}

export function resolveServiceTypeLabel(order: ServiceOrder): string | undefined {
  if (order.serviceTypeLabel?.trim()) {
    return order.serviceTypeLabel.trim();
  }

  if (order.serviceType === "corrective") return "Corretiva";
  if (order.serviceType === "preventive") return "Preventiva";

  return undefined;
}

export function formatScheduledAt(value?: string | null): string | undefined {
  if (!value?.trim()) return undefined;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.trim();
  }

  return date.toLocaleDateString("pt-BR");
}
