export type ChdTabId =
  | "identificacao"
  | "estado-geral"
  | "modulos"
  | "pecas"
  | "servicos"
  | "encerramento";

export type ChdFuelLevel = "reserva" | "1/4" | "1/2" | "3/4" | "cheio";

export type ChdIdentificationForm = {
  os: string;
  date: string;
  time: string;
  brandModel: string;
  platePrefix: string;
  currentKm: string;
  hourMeter: string;
  driver: string;
  technicalResponsible: string;
  fuel: ChdFuelLevel | "";
};

export type ChdChecklistItemStatus = "ok" | "anomaly" | "na" | "";

export type ChdChecklistItemState = {
  status: ChdChecklistItemStatus;
  photo: File | null;
};

export type ChdGeneralStateForm = Record<string, ChdChecklistItemState>;

export type ChdModuleItemState = {
  status: ChdChecklistItemStatus;
};

export type ChdModulesForm = Record<string, ChdModuleItemState>;

export type ChdOldPartDestination =
  | "descarte-ecologico"
  | "devolvida-cliente"
  | "";

export type ChdPartEntry = {
  id: string;
  description: string;
  partNumber: string;
  brand: string;
  oldPartDestination: ChdOldPartDestination;
  newPhoto: File | null;
  replacedPhoto: File | null;
};

export type ChdPartsForm = {
  items: ChdPartEntry[];
};

export type ChdServiceEntry = {
  id: string;
  systemComponent: string;
  initialDiagnosis: string;
  technicalAction: string;
  technician: string;
  manHours: string;
};

export type ChdServicesForm = {
  items: ChdServiceEntry[];
};

export type ChdClosingForm = {
  inventoryChecked: boolean;
  driverSignature: string;
  workshopSignature: string;
};

export type ChdFormState = {
  identification: ChdIdentificationForm;
  generalState: ChdGeneralStateForm;
  modules: ChdModulesForm;
  parts: ChdPartsForm;
  services: ChdServicesForm;
  closing: ChdClosingForm;
};
