import type {
  CheIdentificationForm,
  ChePhotoSlot,
  CheTermForm,
} from "./checklist";

export type ChecklistChegadaInspectionItem = {
  status: string;
  photo?: string;
};

export type ChecklistChegadaBlockItem = {
  status: string;
};

export type PostChecklistChegadaPayload = {
  oficinaId: string;
  parceiroId?: string;
  prefeituraId?: string;
  solicitacaoOsId?: string;
  identification: CheIdentificationForm;
  photos: Partial<Record<ChePhotoSlot, string>>;
  inspection: Record<string, ChecklistChegadaInspectionItem>;
  blocks: Record<string, ChecklistChegadaBlockItem>;
  term: CheTermForm;
};

export type PatchChecklistChegadaFotosPayload = {
  photos: Record<ChePhotoSlot, string>;
  inspection: Record<string, ChecklistChegadaInspectionItem>;
};

export type ChecklistChegada = Omit<
  PostChecklistChegadaPayload,
  "photos"
> & {
  id: string;
  number: string;
  createdAt: string;
  photos: Partial<Record<ChePhotoSlot, string>>;
};

export type PostChecklistChegadaResponse = {
  data: ChecklistChegada;
  message: string;
};

export type ChecklistsChegadaListResponse = {
  data: ChecklistChegada[];
  message: string;
};

export type PatchChecklistChegadaFotosResponse = {
  data: ChecklistChegada;
  message: string;
};

export type UploadChecklistFotoResponse = {
  data?: {
    url?: string;
  };
  message?: string;
};
