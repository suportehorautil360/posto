import type { ChecklistChegada } from "@/features/che/types/checklist-chegada-api";
import type { ChecklistDevolucao } from "@/features/chd/types/checklist-devolucao-api";
import type { Orcamento } from "@/features/service-orders/types/orcamento-api";
import type { ServiceOrder } from "@/features/service-orders/types/service-order";

export type HistoricoActivityKind = "orcamento" | "che" | "chd";

export type HistoricoRecord = {
  order: ServiceOrder;
  orcamento: Orcamento | null;
  checklistsChegada: ChecklistChegada[];
  checklistsDevolucao: ChecklistDevolucao[];
  activityKinds: HistoricoActivityKind[];
  lastActivityAt: string | null;
};

export type HistoricoOficinaData = {
  records: HistoricoRecord[];
};
