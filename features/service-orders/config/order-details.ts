export const serviceOrderDetailsConfig = {
  title: "Detalhes da OS",
  viewDetails: "Ver detalhes",
  close: "Fechar",
  buildQuote: "Montar orçamento",
  noDescription: "Nenhuma descrição informada para esta OS.",
  fields: {
    openedAt: "Abertura",
    scheduledAt: "Agendamento",
    machine: "Equipamento",
    line: "Linha",
    chassis: "Chassi / Prefixo",
    hourMeter: "Horímetro",
    currentKm: "Quilometragem",
    serviceType: "Tipo de OS",
    relato: "Descrição / Relato",
    operator: "Operador",
  },
  serviceTypeLabels: {
    corrective: "Corretiva",
    preventive: "Preventiva",
  },
} as const;
