import { mapBackendStatusFromString } from "@/features/service-orders/lib/map-solicitacao-to-order";

export function formatOrcamentoStatus(status?: string) {
  if (!status) {
    return "—";
  }

  const mapped = mapBackendStatusFromString(status);

  switch (mapped.status) {
    case "recebida":
      return "Recebida";
    case "em-pregao":
      return "Em pregão";
    case "aguardando-peca":
      return "Aguardando peça";
    case "aprovada":
      return "Aprovada";
    case "nao-selecionada":
      return "Não selecionada";
    default:
      return status.replace(/_/g, " ");
  }
}

export function formatOrcamentoDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatLeadTimeDays(days: number) {
  if (!days || days <= 0) {
    return "—";
  }

  return `${days} dia${days === 1 ? "" : "s"}`;
}
