import { getChecklistsChegadaOficina } from "@/features/che/api/get-checklists-chegada-oficina";
import { getChecklistsDevolucaoOficina } from "@/features/chd/api/get-checklists-devolucao-oficina";
import { getOrcamentosOficina } from "@/features/service-orders/api/get-orcamentos-oficina";
import { getSolicitacoesOficina } from "@/features/service-orders/api/get-solicitacoes-oficina";
import { mapSolicitacoesToServiceOrders } from "@/features/service-orders/lib/map-solicitacao-to-order";
import { buildHistoricoRecords } from "../lib/build-historico-items";
import type { HistoricoOficinaData } from "../types/historico";

type LoadHistoricoOficinaOptions = {
  oficinaId: string;
  oficinaName: string;
};

export async function loadHistoricoOficina({
  oficinaId,
  oficinaName,
}: LoadHistoricoOficinaOptions): Promise<HistoricoOficinaData> {
  const [solicitacoes, orcamentos, checklistsChegada, checklistsDevolucao] =
    await Promise.all([
      getSolicitacoesOficina(oficinaId),
      getOrcamentosOficina(oficinaId),
      getChecklistsChegadaOficina(oficinaId),
      getChecklistsDevolucaoOficina(oficinaId),
    ]);

  const orders = mapSolicitacoesToServiceOrders(solicitacoes, {
    oficinaId,
    oficinaName,
  });

  const records = buildHistoricoRecords(
    orders,
    orcamentos,
    checklistsChegada,
    checklistsDevolucao
  );

  return { records };
}
