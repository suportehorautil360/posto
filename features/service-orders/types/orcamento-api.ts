export type OrcamentoItemPayload = {
  description: string;
  value: number;
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
