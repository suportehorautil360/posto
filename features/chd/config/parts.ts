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
  emptyFileLabel: "Nenhum arquivo escolhido",
  chooseFileLabel: "Escolher arquivo",
} as const;
