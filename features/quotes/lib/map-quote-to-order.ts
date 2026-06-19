import { getNextOrderCode } from "@/features/service-orders/lib/order-code";
import type { ServiceOrder } from "@/features/service-orders/types/service-order";
import {
  calculateGrandTotal,
  formatNumberForInput,
  parseNumericInput,
} from "./calculations";
import { createQuoteFormFromOrder } from "./map-order-to-quote";
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
  };
}

export function getQuoteCustomerSyncFromOrder(
  quote: QuoteFormState,
  order: Partial<ServiceOrder>
): QuoteFormState["customer"] {
  return {
    ...quote.customer,
    clientName: order.client ?? quote.customer.clientName,
    machineModel: order.machine ?? quote.customer.machineModel,
    issueDate: order.openedAt
      ? parseDisplayDateToIso(order.openedAt)
      : quote.customer.issueDate,
  };
}

function parseDisplayDateToIso(display: string): string {
  const [day, month, year] = display.split("/");

  if (!day || !month || !year) {
    return new Date().toISOString().slice(0, 10);
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function syncQuotedValueInQuote(
  quote: QuoteFormState,
  quotedValue: number | null
): QuoteFormState {
  if (quotedValue === null || quotedValue <= 0) {
    return quote;
  }

  const currentTotal = calculateGrandTotal(quote);

  if (Math.abs(currentTotal - quotedValue) < 0.01) {
    return quote;
  }

  const updated = structuredClone(quote);

  if (updated.services.length > 0) {
    const firstService = updated.services[0];
    const hours = parseNumericInput(firstService.hours) || 1;

    updated.services[0] = {
      ...firstService,
      hours: formatNumberForInput(hours),
      hourlyRate: formatNumberForInput(quotedValue / hours),
    };

    return updated;
  }

  updated.services = [
    {
      id: crypto.randomUUID(),
      description: "Serviços",
      hourType: "normal",
      hours: "1",
      hourlyRate: formatNumberForInput(quotedValue),
    },
  ];

  return updated;
}

export function createQuoteFromOrderUpdate(
  order: ServiceOrder,
  updates: Partial<ServiceOrder>
): QuoteFormState {
  const mergedOrder: ServiceOrder = { ...order, ...updates };

  return createQuoteFormFromOrder(mergedOrder);
}
