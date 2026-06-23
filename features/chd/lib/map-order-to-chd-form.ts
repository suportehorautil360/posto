import type { QuoteFormState } from "@/features/quotes/types/quote";
import {
  mapQuoteToChdIdentificationExtras,
  mapQuoteToChdParts,
  mapQuoteToChdServices,
} from "@/features/quotes/lib/map-quote-to-checklist-prefill";
import type { ServiceOrder } from "@/features/service-orders/types/service-order";
import type { ChdFormState, ChdIdentificationForm } from "../types/form";
import {
  getInitialClosingForm,
  getInitialGeneralStateForm,
  getInitialIdentificationForm,
  getInitialModulesForm,
  getInitialPartsForm,
  getInitialServicesForm,
} from "./form-defaults";

function getCurrentEntryDate() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentEntryTime() {
  const now = new Date();

  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function mapOrderToChdIdentification(
  order: ServiceOrder,
  quote?: QuoteFormState | null
): ChdIdentificationForm {
  const quoteExtras = quote ? mapQuoteToChdIdentificationExtras(quote) : null;

  return {
    ...getInitialIdentificationForm(),
    os: order.code,
    brandModel:
      quote?.customer.machineModel.trim() || order.machine,
    platePrefix: quoteExtras?.platePrefix ?? "",
    currentKm: quoteExtras?.currentKm ?? "",
    hourMeter: order.horimetro?.trim() ?? "",
    driver: quoteExtras?.driver || order.client,
    date: getCurrentEntryDate(),
    time: getCurrentEntryTime(),
  };
}

export function buildInitialChdForm(
  order?: ServiceOrder,
  quote?: QuoteFormState | null
): ChdFormState {
  if (!order) {
    return {
      identification: getInitialIdentificationForm(),
      generalState: getInitialGeneralStateForm(),
      modules: getInitialModulesForm(),
      parts: getInitialPartsForm(),
      services: getInitialServicesForm(),
      closing: getInitialClosingForm(),
    };
  }

  return {
    identification: mapOrderToChdIdentification(order, quote),
    generalState: getInitialGeneralStateForm(),
    modules: getInitialModulesForm(),
    parts: quote ? mapQuoteToChdParts(quote) : getInitialPartsForm(),
    services: quote ? mapQuoteToChdServices(quote) : getInitialServicesForm(),
    closing: getInitialClosingForm(),
  };
}

export function getChdSaveOrderLinks(order?: ServiceOrder) {
  if (!order || order.source !== "api") {
    return {};
  }

  return {
    solicitacaoOsId: order.id,
    ...(order.ordemServicoId ? { ordemServicoId: order.ordemServicoId } : {}),
    protocolo: order.code,
  };
}
