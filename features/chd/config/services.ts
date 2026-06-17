export const servicesSectionConfig = {
  title: "Serviços Executados",
  fields: {
    systemComponent: "Sistema / Componente",
    initialDiagnosis: "Diagnóstico inicial",
    technicalAction: "Ação técnica executada",
    technician: "Técnico",
    manHours: "Tempo H/H",
  },
  placeholders: {
    systemComponent: "Ex: Sistema hidráulico",
  },
  defaults: {
    manHours: "2.5",
  },
  addSystemLabel: "Adicionar Sistema",
} as const;
