export const chdPageConfig = {
  title: "CHD — Checklist de Devolução",
  meta: {
    endpoint: "POST /chd",
    contentType: "multipart/form-data",
    autoNumberPrefix: "CHD-2026-",
  },
  actions: {
    back: "Voltar",
    next: "Próximo",
    save: "Salvar CHD",
    saving: "Salvando...",
  },
  messages: {
    saveSuccess: "CHD salvo com sucesso!",
    saveSuccessDescription: "Checklist registrado como",
    saveError: "Não foi possível salvar o CHD. Tente novamente.",
  },
} as const;

export const chdTabs = [
  { id: "identificacao", label: "1. Identificação" },
  { id: "estado-geral", label: "2. Estado Geral" },
  { id: "modulos", label: "3. Módulos" },
  { id: "pecas", label: "4. Peças" },
  { id: "servicos", label: "5. Serviços" },
  { id: "encerramento", label: "6. Encerramento" },
] as const;

export const chdTabOrder = chdTabs.map((tab) => tab.id);

export const identificationSectionConfig = {
  title: "Identificação (Obrigatório)",
  fields: {
    date: "Data",
    time: "Hora",
    brandModel: "Modelo/Marca",
    platePrefix: "Placa/Prefixo",
    currentKm: "Km Atual",
    hourMeter: "Horímetro",
    driver: "Condutor (Entrega)",
    technicalResponsible: "Responsável Técnico",
    fuel: "Combustível",
  },
  placeholders: {
    date: "dd/mm/aaaa",
    time: "--:--",
  },
} as const;

export const chdFuelLevelOptions = [
  { value: "reserva", label: "Reserva" },
  { value: "1/4", label: "1/4" },
  { value: "1/2", label: "1/2" },
  { value: "3/4", label: "3/4" },
  { value: "cheio", label: "Cheio" },
] as const;

export const placeholderTabMessages = {
  encerramento: "Revise os dados e finalize o CHD.",
} as const;
