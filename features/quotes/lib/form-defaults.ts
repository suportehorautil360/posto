import type {
  QuoteFormState,
  QuotePartEntry,
  QuoteServiceEntry,
} from "../types/quote";

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
  };
}
