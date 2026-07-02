export const servicesSectionConfig = {
  title: "Serviços Executados",
  fields: {
    systemComponent: "Sistema / Componente",
    initialDiagnosis: "Diagnóstico inicial",
    technicalAction: "Ação técnica executada",
    technician: "Técnico",
    manHours: "Tempo H/H",
    hourType: "Tipo de hora",
    hourlyRate: "Valor/hora",
  },
  placeholders: {
    systemComponent: "Ex: Sistema hidráulico",
  },
  defaults: {
    manHours: "1",
  },
  addSystemLabel: "Adicionar Sistema",
  addMoreLabel: "Adicionar mais",
  prefilledTitle: "Serviços do orçamento",
  prefilledRule:
    "Os serviços foram importados automaticamente do orçamento e não podem ser editados.",
  columns: {
    description: "Descrição",
    hourType: "Tipo hora",
    hours: "Horas",
    hourlyRate: "Valor/h",
  },
  emptyTitle: "Nenhum serviço registrado",
  emptyDescription:
    "Inclua os sistemas atendidos nesta devolução com diagnóstico e tempo de mão de obra.",
  modalTitle: "Adicionar serviço",
  modalDescription:
    "Informe descrição, tipo de hora, horas e valor/hora do serviço executado.",
  modalCancel: "Cancelar",
  modalConfirm: "Adicionar serviço",
  listTitle: "Serviços registrados",
  serviceItemLabel: (index: number) => `Serviço ${index}`,
  messages: {
    noComponent: "Sem componente",
  },
} as const;
