import { getOrcamentoById } from "@/features/service-orders/api/get-orcamento";
import type { ServiceOrder } from "@/features/service-orders/types/service-order";
import { mapOrcamentoToQuoteForm } from "@/features/quotes/lib/map-orcamento-to-detail-sections";
import { resolveQuotePrefill } from "@/features/quotes/lib/resolve-quote-prefill";
import type { QuoteFormState } from "@/features/quotes/types/quote";

function quoteHasParts(quote: QuoteFormState): boolean {
  return quote.parts.some(
    (part) =>
      part.description.trim() ||
      part.code.trim() ||
      part.brand.trim() ||
      part.quantity.trim() ||
      part.unitValue.trim()
  );
}

function quoteHasServices(quote: QuoteFormState): boolean {
  return quote.services.some(
    (service) =>
      service.description.trim() ||
      service.hours.trim() ||
      service.hourlyRate.trim()
  );
}

function quoteHasOrcamentoData(quote: QuoteFormState): boolean {
  return quoteHasParts(quote) || quoteHasServices(quote);
}

/** Resolve quote para CHD: sessionStorage → orçamento na API → fallback da O.S. */
export async function resolveChdQuotePrefill(
  order: ServiceOrder,
  savedQuote: QuoteFormState | null,
  oficinaId?: string
): Promise<QuoteFormState> {
  const localQuote = resolveQuotePrefill(order, savedQuote);

  if (quoteHasOrcamentoData(localQuote)) {
    return localQuote;
  }

  if (!oficinaId) {
    return localQuote;
  }

  try {
    const orcamento = await getOrcamentoById(
      order.ordemServicoId ?? order.id,
      oficinaId
    );
    const fromApi = mapOrcamentoToQuoteForm(orcamento, order, savedQuote);

    if (quoteHasOrcamentoData(fromApi)) {
      return fromApi;
    }

    return localQuote;
  } catch {
    return localQuote;
  }
}

export function quotePrefillHasParts(quote: QuoteFormState): boolean {
  return quoteHasParts(quote);
}

export function quotePrefillHasServices(quote: QuoteFormState): boolean {
  return quoteHasServices(quote);
}
