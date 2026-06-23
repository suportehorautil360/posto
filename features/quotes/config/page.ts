export const newQuotePageConfig = {
  title: "Novo Orçamento",
  buildTitle: "Montar Orçamento",
  editTitle: "Editar Orçamento",
  fixTitle: "Corrigir Orçamento",
  backLabel: "Voltar",
  sections: {
    customer: "Dados do Cliente e Máquina",
    parts: "Peças",
    services: "Mão de Obra / Serviços",
    travel: "Deslocamento",
  },
  fields: {
    issueDate: "Data de Emissão",
    status: "Status",
    clientName: "Nome do Cliente",
    machineModel: "Modelo da Máquina",
    chassisPrefix: "Chassi / Prefixo",
    paymentCondition: "Condição de Pagamento",
    validityDays: "Validade (dias)",
    km: "KM",
    valuePerKm: "VALOR/KM",
    travelHours: "HRS VIAGEM",
    travelHourlyRate: "VALOR HR",
    fees: "TAXAS",
  },
  placeholders: {
    clientName: "Cliente",
    machineModel: "Ex: CAT 320D",
    paymentCondition: "30/60 dias",
    partCode: "Cód.",
  },
  columns: {
    parts: {
      code: "CÓDIGO",
      description: "DESCRIÇÃO",
      brand: "MARCA",
      quantity: "QTD",
      unitValue: "VALOR UNIT.",
      total: "TOTAL",
    },
    services: {
      description: "DESCRIÇÃO",
      hourType: "TIPO HORA",
      hours: "HORAS",
      hourlyRate: "VALOR/H",
      total: "TOTAL",
    },
  },
  hints: {
    parts: "Total da linha = Qtd × Valor unitário (calculado automaticamente).",
    services: "Total da linha = Horas × Valor/hora.",
    travel: "Total = (km × valor/km) + (horas × valor/hora) + taxas extras.",
  },
  actions: {
    addPart: "Adicionar peça",
    addService: "Adicionar serviço",
    cancel: "Cancelar",
    save: "Salvar Orçamento",
    saving: "Salvando...",
  },
  summary: {
    parts: "Subtotal Peças",
    services: "Subtotal Mão de Obra",
    travel: "Subtotal Deslocamento",
    total: "TOTAL",
  },
  messages: {
    saveSuccess: "Orçamento salvo com sucesso!",
    updateSuccess: "Orçamento atualizado com sucesso!",
    submitSuccess: "Orçamento enviado com sucesso!",
    saveError: "Não foi possível salvar o orçamento. Tente novamente.",
    quoteAlreadyExists: "Esta OS já possui orçamento.",
    selectEligibleOrder: "Selecione uma OS sem orçamento cadastrado.",
  },
} as const;

export const quoteStatusOptions = [
  { value: "rascunho", label: "Rascunho" },
  { value: "enviado", label: "Enviado" },
  { value: "aprovado", label: "Aprovado" },
  { value: "rejeitado", label: "Rejeitado" },
] as const;

export const hourTypeOptions = [
  { value: "normal", label: "Normal" },
  { value: "extra", label: "Extra" },
  { value: "noturna", label: "Noturna" },
] as const;
