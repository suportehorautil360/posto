export type SolicitacaoOsTimestamp = {
  _seconds: number;
  _nanoseconds?: number;
};

export type SolicitacaoOsLance = {
  oficinaId: string;
  oficinaNome?: string;
  valor?: number | null;
  prazoDias?: number | null;
  ordemServicoId?: string;
};

export type SolicitacaoOs = {
  id?: string;
  protocolo: string;
  prefeituraId: string;
  equipamentoId?: string;
  chassis?: string;
  chassi?: string;
  equipamento: string;
  linha?: string;
  operador?: string;
  horimetro?: string | number | null;
  hourMeter?: string;
  currentKm?: string;
  km?: string;
  medicaoAtual?: number | null;
  unidadeRevisao?: 'km' | 'h' | '';
  relato?: string;
  oficinas?: string[];
  oficinasIds?: string[];
  oficinasResponderam?: string[];
  oficinaVencedoraId?: string | null;
  status: string;
  serviceType?: string;
  tipoOs?: string;
  dataAgendamento?: string | null;
  criadoEm?: string | SolicitacaoOsTimestamp | null;
  aprovadoEm?: string | SolicitacaoOsTimestamp | null;
  valorOrcado?: number | null;
  valorAprovado?: number | null;
  lances?: SolicitacaoOsLance[];
};

export type SolicitacoesOficinaResponse = {
  data: SolicitacaoOs[];
  message: string;
};
