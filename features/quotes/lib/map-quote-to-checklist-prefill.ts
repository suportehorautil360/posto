import type { ChdPartsForm, ChdServicesForm } from "@/features/chd/types/form";
import {
  getInitialPartsForm,
  getInitialServicesForm,
} from "@/features/chd/lib/form-defaults";
import type { QuoteFormState } from "../types/quote";

function hasQuotePartData(part: QuoteFormState["parts"][number]) {
  return (
    part.description.trim() ||
    part.code.trim() ||
    part.brand.trim() ||
    part.quantity.trim() ||
    part.unitValue.trim()
  );
}

function hasQuoteServiceData(service: QuoteFormState["services"][number]) {
  return (
    service.description.trim() ||
    service.hours.trim() ||
    service.hourlyRate.trim()
  );
}

export function mapQuoteToChdParts(quote: QuoteFormState): ChdPartsForm {
  const items = quote.parts.filter(hasQuotePartData).map((part) => ({
    id: crypto.randomUUID(),
    description: part.description.trim(),
    partNumber: part.code.trim(),
    brand: part.brand.trim(),
    oldPartDestination: "" as const,
    newPhoto: null,
    replacedPhoto: null,
  }));

  if (items.length === 0) {
    return getInitialPartsForm();
  }

  return { items };
}

export function mapQuoteToChdServices(quote: QuoteFormState): ChdServicesForm {
  const items = quote.services.filter(hasQuoteServiceData).map((service) => ({
    id: crypto.randomUUID(),
    systemComponent: service.description.trim(),
    initialDiagnosis: "",
    technicalAction: "",
    technician: "",
    manHours: service.hours.trim(),
  }));

  return { items };
}

export function mapQuoteToChdIdentificationExtras(quote: QuoteFormState) {
  return {
    platePrefix: quote.customer.chassisPrefix.trim(),
    currentKm: quote.travel.km.trim(),
    driver: quote.customer.clientName.trim(),
  };
}

export function mapQuoteToCheIdentificationExtras(quote: QuoteFormState) {
  return {
    client: quote.customer.clientName.trim(),
    brandModel: quote.customer.machineModel.trim(),
    platePrefix: quote.customer.chassisPrefix.trim(),
    km: quote.travel.km.trim(),
  };
}
