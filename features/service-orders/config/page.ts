export const serviceOrdersPageConfig = {
  title: "Ordens de Serviço",
  newQuoteLabel: "Novo Orçamento",
  searchPlaceholder: "Buscar por OS, cliente ou máquina...",
  tabs: {
    recebidas: "OS Recebidas",
    pregao: "Em Pregão",
    resultado: "Resultado",
  },
  tabHints: {
    recebidas: "OS que aguardam seu orçamento. Abra os detalhes para ver relato, equipamento e medições.",
    pregao: "OS em disputa com outras oficinas.",
    resultado: "OS com pregão encerrado — aprovadas ou não selecionadas.",
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
    buildQuote: "Montar orçamento",
    fixQuote: "Corrigir orçamento",
    viewDetails: "Ver detalhes",
  },
  messages: {
    loading: "Carregando ordens de serviço...",
    loadError: "Não foi possível carregar as OS da oficina.",
    retry: "Tentar novamente",
    empty: "Nenhuma OS encontrada para esta oficina.",
    emptyRecebidas: "Nenhuma OS aguardando orçamento.",
  },
} as const;

export const statusLabels = {
  recebida: "Recebida",
  "em-andamento": "Em andamento",
  "aguardando-peca": "Aguardando peça",
  "em-pregao": "Em pregão",
  aprovada: "Aprovada",
  "nao-selecionada": "Não selecionada",
} as const;
