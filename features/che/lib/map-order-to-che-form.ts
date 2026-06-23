import type { QuoteFormState } from "@/features/quotes/types/quote";
import type { ServiceOrder } from "@/features/service-orders/types/service-order";
import {
  mapQuoteToCheIdentificationExtras,
} from "@/features/quotes/lib/map-quote-to-checklist-prefill";
import type { CheFormValues } from "./che-form-schema";
import {
  getInitialBlocksForm,
  getInitialIdentificationForm,
  getInitialInspectionForm,
  getInitialPhotosForm,
  getInitialTermForm,
} from "./form-defaults";

function getCurrentEntryDate() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentEntryTime() {
  const now = new Date();

  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function mapOrderToCheIdentification(
  order: ServiceOrder,
  quote?: QuoteFormState | null
) {
  const quoteExtras = quote ? mapQuoteToCheIdentificationExtras(quote) : null;

  return {
    ...getInitialIdentificationForm(),
    os: order.code,
    client: quoteExtras?.client || order.client,
    brandModel: quoteExtras?.brandModel || order.machine,
    platePrefix: quoteExtras?.platePrefix ?? "",
    km: quoteExtras?.km ?? "",
    entryDate: getCurrentEntryDate(),
    time: getCurrentEntryTime(),
    hourMeter: order.horimetro?.trim() ?? "",
  };
}

export function mapOrderToCheTerm(order: ServiceOrder) {
  return {
    ...getInitialTermForm(),
    symptoms: order.relato?.trim() ?? "",
  };
}

export function applyOrderToCheForm(
  form: CheFormValues,
  order: ServiceOrder,
  quote?: QuoteFormState | null
): CheFormValues {
  return {
    ...form,
    identification: mapOrderToCheIdentification(order, quote),
    term: mapOrderToCheTerm(order),
  };
}

export function buildInitialCheForm(
  order?: ServiceOrder,
  quote?: QuoteFormState | null
): CheFormValues {
  const baseForm: CheFormValues = {
    identification: getInitialIdentificationForm(),
    photos: getInitialPhotosForm(),
    inspection: getInitialInspectionForm(),
    blocks: getInitialBlocksForm(),
    term: getInitialTermForm(),
  };

  if (!order) {
    return baseForm;
  }

  return applyOrderToCheForm(baseForm, order, quote);
}
