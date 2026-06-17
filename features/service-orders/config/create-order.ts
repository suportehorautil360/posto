export type CreateOrderStatus =
  | "rascunho"
  | "enviado"
  | "aprovado"
  | "rejeitado";

export const createOrderFormConfig = {
  title: "Nova OS",
  fields: {
    code: "Nº OS",
    openedAt: "Abertura",
    client: "Cliente",
    machine: "Máquina / Modelo",
    status: "Status",
    value: "Valor (R$)",
  },
  placeholders: {
    client: "Nome do cliente",
    machine: "Ex: CAT 320D",
    value: "0,00",
  },
  actions: {
    cancel: "Cancelar",
    save: "Salvar",
  },
} as const;

export const createOrderStatusOptions: {
  value: CreateOrderStatus;
  label: string;
}[] = [
  { value: "rascunho", label: "Rascunho" },
  { value: "enviado", label: "Enviado" },
  { value: "aprovado", label: "Aprovado" },
  { value: "rejeitado", label: "Rejeitado" },
];
