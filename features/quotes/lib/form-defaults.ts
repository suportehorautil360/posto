import type {
  QuoteFormState,
  QuotePartEntry,
  QuotePhotoUrls,
  QuotePhotosForm,
  QuoteServiceEntry,
} from "../types/quote";
import { quotePhotoSlotIds } from "../types/quote";

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function createEmptyPartEntry(): QuotePartEntry {
  return {
    id: crypto.randomUUID(),
    code: "",
    description: "",
    brand: "",
    quantity: "1",
    unitValue: "0",
  };
}

export function createEmptyServiceEntry(): QuoteServiceEntry {
  return {
    id: crypto.randomUUID(),
    description: "",
    hourType: "normal",
    hours: "1",
    hourlyRate: "0",
  };
}

export function createEmptyPhotosForm(): QuotePhotosForm {
  return {
    equipamento: null,
    defeito: null,
    componente: null,
    complementar: null,
  };
}

export function getInitialQuoteForm(): QuoteFormState {
  return {
    customer: {
      issueDate: getTodayIsoDate(),
      status: "rascunho",
      clientName: "",
      machineModel: "",
      chassisPrefix: "",
      paymentCondition: "",
      validityDays: "15",
    },
    parts: [createEmptyPartEntry()],
    services: [createEmptyServiceEntry()],
    travel: {
      km: "0",
      valuePerKm: "0",
      travelHours: "0",
      hourlyRate: "0",
      fees: "0",
    },
    photos: createEmptyPhotosForm(),
  };
}

export function normalizeQuoteForm(form: QuoteFormState): QuoteFormState {
  const base = getInitialQuoteForm();

  return {
    ...base,
    ...form,
    customer: { ...base.customer, ...form.customer },
    parts: form.parts?.length ? form.parts : base.parts,
    services: form.services?.length ? form.services : base.services,
    travel: { ...base.travel, ...form.travel },
    photos: { ...base.photos, ...form.photos },
    photoUrls: form.photoUrls,
  };
}

export function mapFotosComprovacaoToPhotoUrls(
  fotos: string[] | undefined
): QuotePhotoUrls {
  const urls: QuotePhotoUrls = {};

  quotePhotoSlotIds.forEach((slot, index) => {
    const url = fotos?.[index]?.trim();
    if (url) {
      urls[slot] = url;
    }
  });

  return urls;
}
