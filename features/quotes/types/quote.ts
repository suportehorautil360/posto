export type QuoteStatus = "rascunho" | "enviado" | "aprovado" | "rejeitado";

export type HourType = "normal" | "extra" | "noturna";

export type QuoteCustomerForm = {
  issueDate: string;
  status: QuoteStatus;
  clientName: string;
  machineModel: string;
  chassisPrefix: string;
  paymentCondition: string;
  validityDays: string;
};

export type QuotePartEntry = {
  id: string;
  code: string;
  description: string;
  brand: string;
  quantity: string;
  unitValue: string;
};

export type QuoteServiceEntry = {
  id: string;
  description: string;
  hourType: HourType;
  hours: string;
  hourlyRate: string;
};

export type QuoteTravelForm = {
  km: string;
  valuePerKm: string;
  travelHours: string;
  hourlyRate: string;
  fees: string;
};

export type QuoteFormState = {
  customer: QuoteCustomerForm;
  parts: QuotePartEntry[];
  services: QuoteServiceEntry[];
  travel: QuoteTravelForm;
};
