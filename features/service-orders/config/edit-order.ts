import type { ServiceOrderStatus } from "../types/service-order";

export const editServiceOrderConfig = {
  title: "Editar OS",
  fields: {
    code: "Nº OS",
    openedAt: "Abertura",
    client: "Cliente",
    machine: "Máquina / Modelo",
    status: "Status",
    quotedValue: "Valor Orçado (R$)",
  },
  actions: {
    cancel: "Cancelar",
    save: "Salvar",
  },
  messages: {
    saveSuccess: "OS atualizada com sucesso!",
  },
} as const;

export const editServiceOrderStatusOptions: {
  value: ServiceOrderStatus;
  label: string;
}[] = [
  { value: "recebida", label: "Recebida" },
  { value: "em-andamento", label: "Em andamento" },
  { value: "aguardando-peca", label: "Aguardando peça" },
  { value: "em-pregao", label: "Em pregão" },
];
