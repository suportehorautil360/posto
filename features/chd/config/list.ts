export const chdListPageConfig = {
  title: "Checklists de Devolução",
  subtitle: "Consulte os CHD registrados ou inicie uma nova devolução.",
  actions: {
    new: "Novo CHD",
    view: "Ver detalhes",
    back: "Voltar para lista",
    retry: "Tentar novamente",
  },
  columns: {
    number: "Número",
    equipment: "Equipamento",
    driver: "Condutor",
    status: "Status",
    date: "Registrado em",
    actions: "Ações",
  },
  empty: {
    title: "Nenhum CHD registrado",
    description: "Quando você salvar um checklist de devolução, ele aparecerá aqui.",
  },
  states: {
    loading: "Carregando checklists...",
    error: "Não foi possível carregar os checklists.",
    noOficina: "Selecione uma oficina para ver os checklists.",
  },
} as const;

export const chdDetailPageConfig = {
  registeredAt: "Registrado em",
  sections: {
    identification: "Identificação",
    generalState: "Estado Geral",
    modules: "Módulos",
    parts: "Peças",
    services: "Serviços",
    closing: "Encerramento",
  },
  emptyValue: "—",
  noPhoto: "Sem foto",
  modulesEmpty: "Nenhum módulo preenchido neste checklist.",
  partsEmpty: "Nenhuma peça registrada neste checklist.",
  servicesEmpty: "Nenhum serviço registrado neste checklist.",
  inventoryChecked: "Inventário de bordo conferido",
  inventoryNotChecked: "Inventário de bordo não conferido",
} as const;
