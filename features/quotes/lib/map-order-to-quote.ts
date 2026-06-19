import type { ServiceOrder } from "@/features/service-orders/types/service-order";
import { getTodayIsoDate } from "@/features/service-orders/lib/order-code";
import { formatNumberForInput } from "./calculations";
import { getInitialQuoteForm } from "./form-defaults";
import type { QuoteFormState } from "../types/quote";

function parseDisplayDateToIso(display: string): string {
  const [day, month, year] = display.split("/");

  if (!day || !month || !year) return getTodayIsoDate();

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function seedQuoteValuesFromOrder(
  form: QuoteFormState,
  order: ServiceOrder
): QuoteFormState {
  if (!order.quotedValue || order.quotedValue <= 0) {
    return form;
  }

  return {
    ...form,
    services: [
      {
        id: crypto.randomUUID(),
        description: "Serviços",
        hourType: "normal",
        hours: "1",
        hourlyRate: formatNumberForInput(order.quotedValue),
      },
    ],
  };
}

export function createQuoteFormFromOrder(order: ServiceOrder): QuoteFormState {
  const base = getInitialQuoteForm();

  const withCustomer: QuoteFormState = {
    ...base,
    customer: {
      ...base.customer,
      issueDate: parseDisplayDateToIso(order.openedAt),
      clientName: order.client,
      machineModel: order.machine,
    },
  };

  return seedQuoteValuesFromOrder(withCustomer, order);
}

export function resolveQuoteForm(
  order: ServiceOrder,
  savedQuote: QuoteFormState | null
): QuoteFormState {
  if (savedQuote) {
    return structuredClone(savedQuote);
  }

  return createQuoteFormFromOrder(order);
}
