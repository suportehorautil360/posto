export type CheTabId =
  | "identificacao"
  | "fotos"
  | "inspecao"
  | "blocos"
  | "termo";

export type FuelLevel = "E" | "1/4" | "1/2" | "3/4" | "F";

export type CheIdentificationForm = {
  os: string;
  entryDate: string;
  time: string;
  responsible: string;
  client: string;
  brandModel: string;
  platePrefix: string;
  km: string;
  hourMeter: string;
  fuel: FuelLevel | "";
};

export type ChePhotoSlot =
  | "frontal"
  | "lateralDireita"
  | "traseira"
  | "lateralEsquerda";

export type ChePhotosForm = Record<ChePhotoSlot, File | null>;

export type InspectionItemStatus = "ok" | "anomaly" | "na" | "";

export type InspectionItemState = {
  status: InspectionItemStatus;
  photo: File | null;
};

export type CheInspectionForm = Record<string, InspectionItemState>;

export type BlockItemState = {
  status: InspectionItemStatus;
};

export type CheBlocksForm = Record<string, BlockItemState>;

export type CheTermForm = {
  symptoms: string;
  clientSignature: string;
  workshopSignature: string;
};

export type CheFormState = {
  identification: CheIdentificationForm;
  photos: ChePhotosForm;
  inspection: CheInspectionForm;
  blocks: CheBlocksForm;
  term: CheTermForm;
};
