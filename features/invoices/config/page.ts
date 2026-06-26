export const invoicesPageConfig = {
  title: "Notas Fiscais",
  subtitle: "Envie e acompanhe as notas fiscais da oficina.",
  stats: {
    totalMonth: "Total no mês",
    approved: "Aprovadas",
    pending: "Pendentes",
  },
  upload: {
    title: "Enviar nota fiscal",
    description: "Selecione o PDF da nota para enviar.",
    dropzoneTitle: "Toque para selecionar ou arraste o PDF aqui",
    dropzoneHint: "PDF · até 10 MB",
    uploading: "Enviando...",
    success: "Nota enviada com sucesso.",
    invalidType: "Selecione um arquivo PDF.",
    invalidSize: "O arquivo deve ter no máximo 10 MB.",
    errors: {
      duplicate: "Esta nota já foi enviada.",
      generic: "Não foi possível enviar este arquivo. Tente outro PDF.",
    },
  },
  list: {
    title: "Notas lançadas",
    searchPlaceholder: "Buscar nota, emitente ou chave...",
    emptyTitle: "Nenhuma nota fiscal encontrada",
    emptyDescription:
      "Quando você enviar uma NF-e, ela aparecerá aqui para acompanhamento.",
    filteredEmpty: "Nenhuma nota corresponde aos filtros selecionados.",
  },
  filters: {
    todas: "Todas",
    aprovadas: "Aprovadas",
    pendentes: "Pendentes",
    rejeitadas: "Rejeitadas",
  },
  fields: {
    accessKey: "Chave de acesso",
    attachment: "Anexo",
  },
  states: {
    noOficina: "Selecione uma oficina para gerenciar notas fiscais.",
    loading: "Carregando notas fiscais...",
    loadError: "Não foi possível carregar as notas fiscais.",
    retry: "Tentar novamente",
  },
} as const;

export const invoiceCategoryLabels = {
  servico: "Serviço",
  peca: "Peça",
  combustivel: "Combustível",
  outros: "Outros",
} as const;

export const invoiceDocumentTypeLabels = {
  "nfe-55": "NF-e 55",
  "nfce-65": "NFC-e 65",
} as const;

export const invoiceStatusLabels = {
  aprovada: "Aprovada",
  pendente: "Pendente",
  rejeitada: "Rejeitada",
} as const;

export const MAX_INVOICE_FILE_SIZE_BYTES = 10 * 1024 * 1024;
