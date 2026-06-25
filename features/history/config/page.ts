export const historyPageConfig = {
  title: "Histórico",
  subtitle: "Consulte OS, orçamentos, CHE e CHD em um só lugar.",
  searchPlaceholder: "Buscar por OS, cliente, máquina ou checklist...",
  columns: {
    order: "OS",
    client: "Cliente",
    machine: "Máquina",
    status: "Status",
    documents: "Documentos",
    lastActivity: "Última atividade",
    actions: "Ações",
  },
  documentLabels: {
    orcamento: "Orçamento",
    che: "CHE",
    chd: "CHD",
  },
  actions: {
    view: "Ver histórico",
    retry: "Tentar novamente",
    back: "Voltar ao histórico",
  },
  states: {
    loading: "Carregando histórico...",
    error: "Não foi possível carregar o histórico.",
    noOficina: "Selecione uma oficina para consultar o histórico.",
    notFound: "Histórico não encontrado para esta OS.",
  },
  empty: {
    title: "Nenhum registro no histórico",
    description:
      "Quando a oficina enviar orçamentos ou registrar CHE/CHD, eles aparecerão aqui agrupados por OS.",
  },
  detail: {
    title: "Histórico da OS",
    sections: {
      summary: "Resumo",
      orcamento: "Orçamento",
      che: "Checklists de Chegada (CHE)",
      chd: "Checklists de Devolução (CHD)",
    },
    fields: {
      openedAt: "Abertura",
      quotedValue: "Valor orçado",
      backendStatus: "Status no sistema",
      total: "Valor total",
      leadTime: "Prazo",
      createdAt: "Criado em",
    },
    emptySection: "Nenhum documento registrado nesta seção.",
    links: {
      viewOrcamento: "Ver orçamento",
      viewChe: "Ver CHE",
      viewChd: "Ver CHD",
    },
  },
} as const;
