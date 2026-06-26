import { getNextOrderCode } from "@/features/service-orders/lib/order-code";
import type { ServiceOrder } from "@/features/service-orders/types/service-order";
import type { QuoteFormState } from "../types/quote";

function formatIsoDateToDisplay(iso: string): string {
  const [year, month, day] = iso.split("-");

  if (!year || !month || !day) return iso;

  return `${day}/${month}/${year}`;
}

export function getOrderUpdatesFromQuote(
  form: QuoteFormState,
  grandTotal: number
): Partial<ServiceOrder> {
  return {
    client: form.customer.clientName.trim(),
    machine: form.customer.machineModel.trim(),
    openedAt: formatIsoDateToDisplay(form.customer.issueDate),
    quotedValue: grandTotal > 0 ? grandTotal : null,
  };
}

export function buildServiceOrderFromQuote(
  form: QuoteFormState,
  grandTotal: number,
  orders: ServiceOrder[]
): ServiceOrder {
  return {
    id: crypto.randomUUID(),
    code: getNextOrderCode(orders),
    client: form.customer.clientName.trim(),
    machine: form.customer.machineModel.trim(),
    openedAt: formatIsoDateToDisplay(form.customer.issueDate),
    status: "recebida",
    quotedValue: grandTotal > 0 ? grandTotal : null,
    tab: "recebidas",
    source: "local",
  };
}
