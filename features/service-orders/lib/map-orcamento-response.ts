import type { PostOrcamentoData } from "../types/orcamento-api";
import type { ServiceOrder } from "../types/service-order";
import { mapBackendStatusFromString } from "./map-solicitacao-to-order";

export function getOrderUpdatesFromOrcamentoResponse(
  response: PostOrcamentoData,
  formUpdates: Partial<ServiceOrder>
): Partial<ServiceOrder> {
  const mappedStatus = mapBackendStatusFromString(response.solicitacaoStatus);

  return {
    ...formUpdates,
    ordemServicoId: response.id,
    quotedValue: response.valorTotal,
    tab: mappedStatus.tab,
    status: mappedStatus.status,
    backendStatus: response.solicitacaoStatus,
  };
}
