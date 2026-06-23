export const cheListPageConfig = {
  title: "Checklists de Chegada",
  subtitle: "Consulte os CHE registrados ou inicie um novo atendimento.",
  actions: {
    new: "Novo CHE",
    view: "Ver detalhes",
    back: "Voltar para lista",
    retry: "Tentar novamente",
  },
  columns: {
    number: "Número",
    os: "O.S.",
    client: "Cliente",
    equipment: "Equipamento",
    date: "Registrado em",
    actions: "Ações",
  },
  empty: {
    title: "Nenhum CHE registrado",
    description: "Quando você salvar um checklist de chegada, ele aparecerá aqui.",
  },
  states: {
    loading: "Carregando checklists...",
    error: "Não foi possível carregar os checklists.",
    noOficina: "Selecione uma oficina para ver os checklists.",
  },
} as const;

export const cheDetailPageConfig = {
  registeredAt: "Registrado em",
  sections: {
    identification: "Identificação",
    photos: "Fotos",
    inspection: "Inspeção",
    blocks: "Blocos",
    term: "Termo",
  },
  emptyValue: "—",
  noPhoto: "Sem foto",
  blocksEmpty: "Nenhum bloco preenchido neste checklist.",
} as const;
