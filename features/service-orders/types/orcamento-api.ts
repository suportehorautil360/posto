export type OrcamentoItemCategory = "part" | "service" | "travel";

export type OrcamentoItemPayload = {
  description: string;
  value: number;
  category?: OrcamentoItemCategory;
  code?: string;
  brand?: string;
  quantity?: number;
  unitValue?: number;
  hourType?: string;
  hours?: number;
  hourlyRate?: number;
  km?: number;
  valuePerKm?: number;
  travelHours?: number;
  travelHourlyRate?: number;
  fees?: number;
};

export type OrcamentoItem = OrcamentoItemPayload;

export type Orcamento = {
  id: string;
  protocol: string;
  solicitacaoOsId: string;
  oficinaId: string;
  valorTotal: number;
  prazoDias: number;
  items: OrcamentoItem[];
  equipamento?: string;
  operador?: string;
  solicitacaoStatus?: string;
  createdAt?: string;
};

export type PostOrcamentoPayload = {
  solicitacaoOsId: string;
  oficinaId: string;
  prazoDias: number;
  items: OrcamentoItemPayload[];
};

export type PatchOrcamentoPayload = {
  oficinaId: string;
  prazoDias: number;
  items: OrcamentoItemPayload[];
};

export type PostOrcamentoData = {
  id: string;
  protocol: string;
  valorTotal: number;
  prazoDias: number;
  solicitacaoStatus: string;
};

export type PostOrcamentoResponse = {
  data: PostOrcamentoData;
  message: string;
};

export type OrcamentosListResponse = {
  data: Orcamento[];
  message: string;
};

export type OrcamentoResponse = {
  data: Orcamento;
  message: string;
};
