export const serviceOrdersPageConfig = {
  title: "Ordens de Serviço",
  registerReceivedLabel: "Cadastrar OS recebida",
  searchPlaceholder: "Buscar por OS, cliente ou máquina...",
  tabs: {
    recebidas: "OS Recebidas",
    pregao: "Em Pregão",
  },
  columns: {
    code: "OS",
    client: "Cliente",
    machine: "Máquina",
    openedAt: "Abertura",
    status: "Status",
    quotedValue: "Valor Orçado",
    actions: "Ações",
  },
  actions: {
    fixQuote: "Corrigir orçamento",
  },
} as const;

export const statusLabels = {
  recebida: "Recebida",
  "em-andamento": "Em andamento",
  "aguardando-peca": "Aguardando peça",
  "em-pregao": "Em pregão",
} as const;
