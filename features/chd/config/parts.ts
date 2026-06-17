export const partsSectionConfig = {
  title: "Registro Técnico de Peças",
  rule:
    "Regra: cada peça → pecas[n][foto_nova] + pecas[n][foto_substituida] obrigatórios",
  fields: {
    description: "Descrição da Peça",
    partNumber: "Part Number",
    brand: "Marca",
    oldPartDestination: "Destinação peça velha",
    newPhoto: "Foto peça NOVA",
    replacedPhoto: "Foto peça SUBSTITUÍDA",
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
