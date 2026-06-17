export const modulesSectionConfig = {
  hint: "Preencha apenas se aplicável ao equipamento.",
  columns: {
    item: "Item",
    ok: "OK",
    anomaly: "A",
    na: "NA",
  },
  sections: [
    {
      id: "linha-amarela",
      title: "Bloco A — Linha Amarela (escavadeira, pá, retro)",
      items: [
        { id: "hidraulico", label: "Sistema hidráulico (mangueiras/cilindros)" },
        { id: "laminaConcha", label: "Lâmina / concha / caçamba" },
        { id: "esteiras", label: "Esteiras / material rodante" },
        { id: "bracoLanca", label: "Braço / lança e articulações" },
        { id: "pinosBuchas", label: "Pinos, buchas e graxa" },
        { id: "motorFluidos", label: "Motor e nível de fluidos" },
        { id: "ropsFops", label: "Estrutura ROPS/FOPS (proteção)" },
      ],
    },
    {
      id: "rodoviario",
      title: "Bloco B — Rodoviário (caminhões/carretas)",
      items: [
        { id: "tacografo", label: "Tacógrafo" },
        { id: "freiosAr", label: "Freios e sistema de ar" },
        { id: "suspensao", label: "Suspensão e feixe de molas" },
        { id: "quintaRoda", label: "Quinta roda / engate" },
        { id: "cardan", label: "Cardan e diferencial" },
        { id: "escapamentoArla", label: "Escapamento e ARLA" },
        { id: "iluminacaoCarreta", label: "Iluminação de carreta/baú" },
      ],
    },
    {
      id: "agricola",
      title: "Bloco C — Agrícola (tratores/colheitadeiras)",
      items: [
        { id: "tdp", label: "Tomada de potência (TDP)" },
        { id: "hidraulicoEngate", label: "Hidráulico e engate de 3 pontos" },
        { id: "pneusLastro", label: "Pneus agrícolas / lastro" },
        { id: "tracao4x4", label: "Tração 4x4 / bloqueio diferencial" },
        { id: "acoplamento", label: "Acoplamento de implemento" },
        { id: "filtroAr", label: "Filtro de ar e arrefecimento" },
      ],
    },
  ],
} as const;
