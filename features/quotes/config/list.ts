export const quotesListPageConfig = {
  title: "Orçamentos",
  subtitle: "Consulte os orçamentos enviados pela oficina ou monte um novo.",
  actions: {
    new: "Novo orçamento",
    view: "Ver detalhes",
    retry: "Tentar novamente",
    back: "Voltar para lista",
  },
  columns: {
    protocol: "OS",
    equipment: "Equipamento",
    client: "Cliente",
    total: "Valor total",
    leadTime: "Prazo",
    status: "Status",
    date: "Enviado em",
    actions: "Ações",
  },
  empty: {
    title: "Nenhum orçamento enviado",
    description:
      "Quando você salvar um orçamento vinculado a uma OS, ele aparecerá aqui.",
  },
  states: {
    loading: "Carregando orçamentos...",
    error: "Não foi possível carregar os orçamentos.",
    noOficina: "Selecione uma oficina para ver os orçamentos.",
  },
} as const;

export const quoteDetailPageConfig = {
  sections: {
    summary: "Resumo",
  },
  fields: {
    protocol: "OS",
    equipment: "Equipamento",
    client: "Cliente",
    total: "Valor total",
    leadTime: "Prazo",
    status: "Status da solicitação",
    sentAt: "Enviado em",
  },
  emptyValue: "—",
  partsEmpty: "Nenhuma peça registrada neste orçamento.",
  servicesEmpty: "Nenhum serviço registrado neste orçamento.",
  states: {
    loading: "Carregando orçamento...",
    error: "Não foi possível carregar o orçamento.",
  },
} as const;
