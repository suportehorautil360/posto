import type { ServiceOrder } from "@/features/service-orders/types/service-order";
import { createQuoteFormFromOrder } from "./map-order-to-quote";
import type { QuoteFormState } from "../types/quote";

export function resolveQuotePrefill(
  order: ServiceOrder,
  savedQuote: QuoteFormState | null
): QuoteFormState {
  if (savedQuote) {
    return structuredClone(savedQuote);
  }

  return createQuoteFormFromOrder(order);
}

export function getQuoteCustomerFields(quote: QuoteFormState) {
  return quote.customer;
}

export function getQuoteTravelFields(quote: QuoteFormState) {
  return quote.travel;
}
