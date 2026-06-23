export const resultadoPageConfig = {
  empty: "Nenhuma OS com resultado registrado.",
  viewDetails: "Ver detalhes",
  fields: {
    yourBid: "Seu lance",
    approvedValue: "Valor aprovado",
    approvedAt: "Aprovado em",
  },
  outcomes: {
    won: {
      title: "Orçamento aprovado pela prefeitura",
      description: "Você venceu o pregão desta OS.",
      action: "Iniciar atendimento",
    },
    lost: {
      title: "Pregão encerrado",
      description: "Outra oficina foi selecionada para esta OS.",
    },
    rejected: {
      title: "Orçamento não selecionado",
      description: "Sua proposta não foi escolhida nesta disputa.",
    },
  },
} as const;
