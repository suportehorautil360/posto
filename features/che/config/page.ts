export const chePageConfig = {
  title: "CHE — Checklist de Chegada",
  prototypeBadge: "Protótipo",
  meta: {
    endpoint: "POST /checklist-chegada",
    uploadEndpoint: "POST /uploads/foto",
    fotosEndpoint: "PATCH /checklist-chegada/:id/fotos",
    contentType: "application/json",
    autoNumberPrefix: "CHE-2026-",
  },
  actions: {
    back: "Voltar",
    next: "Próximo",
    save: "Salvar CHE",
    saving: "Salvando...",
  },
  messages: {
    saveSuccess: "CHE salvo com sucesso!",
    saveSuccessDescription: "Checklist registrado como",
    saveError: "Não foi possível salvar o CHE. Tente novamente.",
  },
} as const;

export const cheTabs = [
  { id: "identificacao", label: "1. Identificação" },
  { id: "fotos", label: "2. Fotos" },
  { id: "inspecao", label: "3. Inspeção" },
  { id: "blocos", label: "4. Blocos" },
  { id: "termo", label: "5. Termo" },
] as const;

export const cheTabOrder = cheTabs.map((tab) => tab.id);

export const identificationSectionConfig = {
  title: "Identificação Geral",
  fields: {
    os: "O.S.",
    entryDate: "Data entrada",
    time: "Hora",
    responsible: "Responsável",
    client: "Cliente",
    brandModel: "Marca/Modelo",
    platePrefix: "Placa/Prefixo",
    km: "KM",
    hourMeter: "Horímetro",
    fuel: "Combustível",
  },
  placeholders: {
    entryDate: "dd/mm/aaaa",
    time: "--:--",
  },
} as const;

export const fuelLevelOptions = ["E", "1/4", "1/2", "3/4", "F"] as const;

export const photosSectionConfig = {
  title: "4 Fotos obrigatórias do equipamento",
  emptyFileLabel: "Nenhum arquivo escolhido",
  chooseFileLabel: "Escolher arquivo",
  fields: [
    { id: "frontal", label: "FOTO 1 — Frontal / Painel" },
    { id: "lateralDireita", label: "FOTO 2 — Lateral direita" },
    { id: "traseira", label: "FOTO 3 — Traseira" },
    { id: "lateralEsquerda", label: "FOTO 4 — Lateral esquerda" },
  ],
} as const;
