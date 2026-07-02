export const partsSectionConfig = {
  title: "Registro Técnico de Peças",
  rule:
    "Preencha os dados abaixo e clique em Adicionar Peça. Cada peça precisa das duas fotos (nova e substituída).",
  messages: {
    noDescription: "Sem descrição",
  },
  fields: {
    description: {
      label: "Descrição da Peça",
      required: "Informe a descrição da peça antes de adicionar.",
    },
    partNumber: {
      label: "Part Number",
    },
    brand: {
      label: "Marca",
    },
    oldPartDestination: {
      label: "Destinação peça velha",
      required: "Selecione a destinação da peça velha.",
    },
    newPhoto: {
      label: "Foto peça NOVA",
      required: "Informe a foto da peça nova.",
    },
    replacedPhoto: {
      label: "Foto peça SUBSTITUÍDA",
      required: "Informe a foto da peça substituída.",
    },
  },
  placeholders: {
    description: "Ex: Filtro hidráulico",
  },
  destinations: [
    { value: "descarte-ecologico", label: "Descarte ecológico" },
    { value: "devolvida-cliente", label: "Devolvida ao cliente" },
  ],
  addPartLabel: "Adicionar Peça",
  partItemLabel: (index: number) => `Peça ${index}`,
  prefilledTitle: "Peças do orçamento",
  prefilledRule:
    "As peças foram importadas automaticamente do orçamento. Adicione as duas fotos de cada item (nova e substituída).",
  addMoreLabel: "Adicionar mais",
  emptyTitle: "Nenhuma peça registrada",
  emptyDescription:
    "Inclua as peças substituídas no serviço. Cada item precisa de descrição, destinação e duas fotos.",
  modalTitle: "Adicionar peça",
  modalDescription:
    "Preencha os dados da peça. Serão necessárias as fotos da peça nova e da peça substituída.",
  modalCancel: "Cancelar",
  modalConfirm: "Adicionar peça",
  listTitle: "Peças registradas",
  emptyFileLabel: "Nenhum arquivo escolhido",
  chooseFileLabel: "Escolher arquivo",
} as const;
