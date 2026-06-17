export const inspectionSectionConfig = {
  hint: "Marque",
  hintHighlight: "A (Anomalia)",
  hintSuffix: "para abrir o campo de foto obrigatório.",
  columns: {
    item: "Item",
    ok: "OK",
    anomaly: "A",
    na: "NA",
  },
  photoLabel: "Foto da anomalia",
  emptyFileLabel: "Nenhum arquivo escolhido",
  chooseFileLabel: "Escolher arquivo",
  sections: [
    {
      id: "externa",
      title: "Inspeção Externa",
      items: [
        { id: "vidros", label: "Vidros, para-brisa e janelas" },
        { id: "retrovisores", label: "Retrovisores e espelhos" },
        { id: "limpadores", label: "Limpadores e esguicho" },
        { id: "farois", label: "Faróis, lanternas e setas" },
        { id: "pintura", label: "Pintura, lataria e amassados" },
        { id: "pneus", label: "Pneus, rodas e estepe" },
        { id: "chassi", label: "Chassi / estrutura aparente" },
        { id: "vazamentos", label: "Vazamentos visíveis (óleo/água)" },
        { id: "bateria", label: "Bateria e cabos" },
      ],
    },
    {
      id: "cabine",
      title: "Cabine e Interior",
      items: [
        { id: "painel", label: "Painel de instrumentos e luzes-espia" },
        { id: "bancos", label: "Bancos e cintos de segurança" },
        { id: "arCondicionado", label: "Ar-condicionado / ventilação" },
        { id: "comandos", label: "Comandos e alavancas" },
        { id: "freioEstacionamento", label: "Freio de estacionamento" },
        { id: "buzina", label: "Buzina e alarme de ré" },
        { id: "limpezaInterna", label: "Limpeza interna" },
      ],
    },
  ],
} as const;

export type InspectionItemId =
  (typeof inspectionSectionConfig.sections)[number]["items"][number]["id"];
