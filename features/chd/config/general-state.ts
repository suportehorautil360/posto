export const generalStateSectionConfig = {
  anomalyHint: {
    prefix: "Marque",
    highlight: "A (Anomalia)",
    suffix: "para abrir o campo de foto obrigatório.",
  },
  functionalHint: "Itens testados após o serviço.",
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
      id: "estado-geral",
      title: "Estado Geral",
      showAnomalyHint: true,
      items: [
        { id: "limpezaInterna", label: "Limpeza interna" },
        { id: "limpezaExterna", label: "Limpeza externa / lavagem" },
        { id: "avariasFunilaria", label: "Avarias funilaria / pintura" },
        { id: "vidrosRetrovisores", label: "Vidros e retrovisores" },
        { id: "pneusRodas", label: "Pneus e rodas" },
        { id: "iluminacaoGeral", label: "Iluminação geral" },
        { id: "niveisFluidos", label: "Níveis de fluidos completados" },
        { id: "ausenciaVazamentos", label: "Ausência de vazamentos" },
      ],
    },
    {
      id: "verificacao-funcional",
      title: "Verificação Funcional",
      showAnomalyHint: false,
      items: [
        { id: "motor", label: "Motor — partida e funcionamento" },
        { id: "freios", label: "Freios testados" },
        { id: "hidraulico", label: "Sistema hidráulico" },
        { id: "transmissao", label: "Transmissão / câmbio" },
        { id: "parteEletrica", label: "Parte elétrica e painel" },
        { id: "arCondicionado", label: "Ar-condicionado" },
        { id: "testeCarga", label: "Teste sob carga / operação" },
      ],
    },
  ],
} as const;
