import type { PregaoBid } from "./pregao-bid";
import type { ServiceOrderResultado } from "./order-resultado";

export type ServiceOrderStatus =
  | "recebida"
  | "em-andamento"
  | "aguardando-peca"
  | "em-pregao"
  | "aprovada"
  | "nao-selecionada";

export type ServiceOrderTab = "recebidas" | "pregao" | "resultado";

export type ServiceOrderSource = "api" | "local";

export type ServiceOrder = {
  id: string;
  code: string;
  client: string;
  machine: string;
  openedAt: string;
  status: ServiceOrderStatus;
  quotedValue: number | null;
  tab: ServiceOrderTab;
  source?: ServiceOrderSource;
  backendStatus?: string;
  relato?: string;
  linha?: string;
  chassisPrefix?: string;
  horimetro?: string;
  hourMeter?: string;
  currentKm?: string;
  km?: string;
  serviceType?: string;
  serviceTypeLabel?: string;
  dataAgendamento?: string | null;
  prefeituraId?: string;
  ordemServicoId?: string;
  pregaoBids?: PregaoBid[];
  resultado?: ServiceOrderResultado;
};
