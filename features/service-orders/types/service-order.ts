export type ServiceOrderStatus =
  | "recebida"
  | "em-andamento"
  | "aguardando-peca"
  | "em-pregao";

export type ServiceOrderTab = "recebidas" | "pregao";

export type ServiceOrder = {
  id: string;
  code: string;
  client: string;
  machine: string;
  openedAt: string;
  status: ServiceOrderStatus;
  quotedValue: number | null;
  tab: ServiceOrderTab;
};
