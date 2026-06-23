import type { ChdClosingForm, ChdServicesForm } from "./form";

export type ChecklistDevolucaoIdentification = {
  os?: string;
  date: string;
  time: string;
  brandModel: string;
  platePrefix: string;
  currentKm: string;
  hourMeter: string;
  driver: string;
  technicalResponsible: string;
  fuel: string;
};

export type ChecklistDevolucaoItem = {
  status: string;
  photo?: string;
};

export type ChecklistDevolucaoModuleItem = {
  status: string;
};

export type ChecklistDevolucaoPartItem = {
  description: string;
  partNumber: string;
  brand: string;
  oldPartDestination: string;
  newPhoto: string;
  replacedPhoto: string;
};

export type ChecklistDevolucaoServiceItem = {
  systemComponent: string;
  initialDiagnosis: string;
  technicalAction: string;
  technician: string;
  manHours: string;
};

export type PostChecklistDevolucaoPayload = {
  id: string;
  oficinaId: string;
  parceiroId?: string;
  prefeituraId?: string;
  solicitacaoOsId?: string;
  ordemServicoId?: string;
  protocolo?: string;
  identification: ChecklistDevolucaoIdentification;
  generalState: Record<string, ChecklistDevolucaoItem>;
  modules: Record<string, ChecklistDevolucaoModuleItem>;
  parts: {
    items: ChecklistDevolucaoPartItem[];
  };
  services: {
    items: ChecklistDevolucaoServiceItem[];
  };
  closing: ChdClosingForm;
};

export type PatchChecklistDevolucaoFotosPayload = {
  generalState?: Record<string, ChecklistDevolucaoItem>;
  parts?: {
    items: ChecklistDevolucaoPartItem[];
  };
};

export type ChecklistDevolucao = PostChecklistDevolucaoPayload & {
  number: string;
  createdAt: string;
  status?: string;
};

export type PostChecklistDevolucaoResponse = {
  data: ChecklistDevolucao;
  message: string;
};

export type ChecklistsDevolucaoListResponse = {
  data: ChecklistDevolucao[];
  message: string;
};
