import type {
  Orcamento,
  OrcamentoItem,
} from "@/features/service-orders/types/orcamento-api";
import type { ServiceOrder } from "@/features/service-orders/types/service-order";
import {
  calculatePartTotal,
  calculateServiceTotal,
  calculateTravelTotal,
  formatNumberForInput,
} from "./calculations";
import {
  createEmptyPartEntry,
  createEmptyServiceEntry,
  getInitialQuoteForm,
} from "./form-defaults";
import { createQuoteFormFromOrder } from "./map-order-to-quote";
import type {
  QuoteFormState,
  QuotePartEntry,
  QuoteServiceEntry,
  QuoteTravelForm,
} from "../types/quote";

export type QuoteDetailSections = {
  parts: QuotePartEntry[];
  services: QuoteServiceEntry[];
  travel: QuoteTravelForm;
};

function hasPartData(part: QuotePartEntry) {
  return (
    part.code.trim() ||
    part.description.trim() ||
    part.brand.trim() ||
    calculatePartTotal(part.quantity, part.unitValue) > 0
  );
}

function hasServiceData(service: QuoteServiceEntry) {
  return (
    service.description.trim() ||
    calculateServiceTotal(service.hours, service.hourlyRate) > 0
  );
}

function sectionsFromQuoteForm(form: QuoteFormState): QuoteDetailSections {
  const parts = form.parts.filter(hasPartData);
  const services = form.services.filter(hasServiceData);

  return {
    parts: parts.length > 0 ? parts : [],
    services: services.length > 0 ? services : [],
    travel: { ...form.travel },
  };
}

function mapItemToPart(item: OrcamentoItem, index: number): QuotePartEntry | null {
  if (
    item.category === "service" ||
    item.category === "travel" ||
    item.description === "Deslocamento"
  ) {
    return null;
  }

  if (
    item.category === "part" ||
    item.code ||
    item.brand ||
    item.quantity != null ||
    item.unitValue != null
  ) {
    return {
      id: `part-${index}`,
      code: item.code?.trim() ?? "",
      description: item.description.trim(),
      brand: item.brand?.trim() ?? "",
      quantity:
        item.quantity != null
          ? formatNumberForInput(item.quantity)
          : "1",
      unitValue:
        item.unitValue != null
          ? formatNumberForInput(item.unitValue)
          : formatNumberForInput(item.value),
    };
  }

  return null;
}

function mapItemToService(
  item: OrcamentoItem,
  index: number
): QuoteServiceEntry | null {
  if (
    item.category === "part" ||
    item.category === "travel" ||
    item.description === "Deslocamento"
  ) {
    return null;
  }

  if (item.category === "service" || item.hours != null || item.hourlyRate != null) {
    return {
      id: `service-${index}`,
      description: item.description.trim(),
      hourType:
        item.hourType === "extra" || item.hourType === "noturna"
          ? item.hourType
          : "normal",
      hours:
        item.hours != null ? formatNumberForInput(item.hours) : "1",
      hourlyRate:
        item.hourlyRate != null
          ? formatNumberForInput(item.hourlyRate)
          : formatNumberForInput(item.value),
    };
  }

  return {
    id: `service-${index}`,
    description: item.description.trim(),
    hourType: "normal",
    hours: "1",
    hourlyRate: formatNumberForInput(item.value),
  };
}

function mapTravelFromItems(items: OrcamentoItem[]): QuoteTravelForm {
  const travelItem = items.find(
    (item) => item.category === "travel" || item.description === "Deslocamento"
  );

  if (!travelItem) {
    return getInitialQuoteForm().travel;
  }

  return {
    km:
      travelItem.km != null ? formatNumberForInput(travelItem.km) : "0",
    valuePerKm:
      travelItem.valuePerKm != null
        ? formatNumberForInput(travelItem.valuePerKm)
        : "0",
    travelHours:
      travelItem.travelHours != null
        ? formatNumberForInput(travelItem.travelHours)
        : "0",
    hourlyRate:
      travelItem.travelHourlyRate != null
        ? formatNumberForInput(travelItem.travelHourlyRate)
        : "0",
    fees:
      travelItem.fees != null ? formatNumberForInput(travelItem.fees) : "0",
  };
}

function sectionsFromOrcamentoItems(items: OrcamentoItem[]): QuoteDetailSections {
  const parts = items
    .map(mapItemToPart)
    .filter((entry): entry is QuotePartEntry => entry != null);
  const services = items
    .map(mapItemToService)
    .filter((entry): entry is QuoteServiceEntry => entry != null);

  return {
    parts,
    services,
    travel: mapTravelFromItems(items),
  };
}

function hasTravelData(travel: QuoteTravelForm) {
  return calculateTravelTotal(
    travel.km,
    travel.valuePerKm,
    travel.travelHours,
    travel.hourlyRate,
    travel.fees
  ) > 0;
}

export function resolveQuoteDetailSections(
  orcamento: Orcamento,
  savedQuote: QuoteFormState | null
): QuoteDetailSections {
  const fromApi =
    orcamento.items.length > 0
      ? sectionsFromOrcamentoItems(orcamento.items)
      : {
          parts: [] as QuotePartEntry[],
          services: [] as QuoteServiceEntry[],
          travel: getInitialQuoteForm().travel,
        };

  if (!savedQuote) {
    return fromApi;
  }

  const fromSaved = sectionsFromQuoteForm(savedQuote);

  return {
    parts: fromSaved.parts.length > 0 ? fromSaved.parts : fromApi.parts,
    services:
      fromSaved.services.length > 0 ? fromSaved.services : fromApi.services,
    travel: hasTravelData(fromSaved.travel) ? fromSaved.travel : fromApi.travel,
  };
}

export function calculateQuoteDetailSubtotals(sections: QuoteDetailSections) {
  const partsSubtotal = sections.parts.reduce(
    (total, part) => total + calculatePartTotal(part.quantity, part.unitValue),
    0
  );

  const servicesSubtotal = sections.services.reduce(
    (total, service) =>
      total + calculateServiceTotal(service.hours, service.hourlyRate),
    0
  );

  const travelSubtotal = calculateTravelTotal(
    sections.travel.km,
    sections.travel.valuePerKm,
    sections.travel.travelHours,
    sections.travel.hourlyRate,
    sections.travel.fees
  );

  return {
    partsSubtotal,
    servicesSubtotal,
    travelSubtotal,
    grandTotal: partsSubtotal + servicesSubtotal + travelSubtotal,
  };
}

export function mapOrcamentoToQuoteForm(
  orcamento: Orcamento,
  order: ServiceOrder,
  savedQuote?: QuoteFormState | null
): QuoteFormState {
  const base = savedQuote
    ? structuredClone(savedQuote)
    : createQuoteFormFromOrder(order);
  const sections = resolveQuoteDetailSections(orcamento, savedQuote ?? null);

  return {
    customer: {
      ...base.customer,
      validityDays:
        orcamento.prazoDias > 0
          ? String(orcamento.prazoDias)
          : base.customer.validityDays,
      status: "rascunho",
    },
    parts:
      sections.parts.length > 0 ? sections.parts : [createEmptyPartEntry()],
    services:
      sections.services.length > 0
        ? sections.services
        : [createEmptyServiceEntry()],
    travel: hasTravelData(sections.travel)
      ? sections.travel
      : base.travel,
  };
}
