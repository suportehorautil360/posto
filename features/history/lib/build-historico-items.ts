import type { ChecklistChegada } from "@/features/che/types/checklist-chegada-api";
import type { ChecklistDevolucao } from "@/features/chd/types/checklist-devolucao-api";
import type { Orcamento } from "@/features/service-orders/types/orcamento-api";
import type { ServiceOrder } from "@/features/service-orders/types/service-order";
import type {
  HistoricoActivityKind,
  HistoricoOficinaData,
  HistoricoRecord,
} from "../types/historico";
import { parseActivityDate } from "./parse-activity-date";

function normalizeToken(value: string | undefined | null) {
  return value?.trim().toLowerCase() ?? "";
}

function matchesOrderId(
  candidate: string | undefined,
  order: ServiceOrder
) {
  const normalized = normalizeToken(candidate);

  if (!normalized) {
    return false;
  }

  return (
    normalized === normalizeToken(order.id) ||
    normalized === normalizeToken(order.code) ||
    (order.ordemServicoId
      ? normalized === normalizeToken(order.ordemServicoId)
      : false)
  );
}

function findOrcamentoForOrder(order: ServiceOrder, orcamentos: Orcamento[]) {
  return (
    orcamentos.find(
      (orcamento) =>
        matchesOrderId(orcamento.solicitacaoOsId, order) ||
        matchesOrderId(orcamento.id, order)
    ) ?? null
  );
}

function findChecklistsChegadaForOrder(
  order: ServiceOrder,
  checklists: ChecklistChegada[]
) {
  return checklists.filter(
    (checklist) =>
      matchesOrderId(checklist.solicitacaoOsId, order) ||
      normalizeToken(checklist.identification.os) === normalizeToken(order.code)
  );
}

function findChecklistsDevolucaoForOrder(
  order: ServiceOrder,
  checklists: ChecklistDevolucao[]
) {
  return checklists.filter(
    (checklist) =>
      matchesOrderId(checklist.solicitacaoOsId, order) ||
      matchesOrderId(checklist.ordemServicoId, order) ||
      normalizeToken(checklist.identification.os) === normalizeToken(order.code) ||
      (checklist.protocolo
        ? normalizeToken(checklist.protocolo) === normalizeToken(order.code)
        : false)
  );
}

function resolveLastActivityAt(record: Omit<HistoricoRecord, "lastActivityAt">) {
  const candidates = [
    record.orcamento?.createdAt,
    ...record.checklistsChegada.map((item) => item.createdAt),
    ...record.checklistsDevolucao.map((item) => item.createdAt),
  ];

  let latest: Date | null = null;

  for (const candidate of candidates) {
    const date = parseActivityDate(candidate);

    if (!date) {
      continue;
    }

    if (!latest || date.getTime() > latest.getTime()) {
      latest = date;
    }
  }

  return latest ? latest.toISOString() : null;
}

function resolveActivityKinds(
  record: Omit<HistoricoRecord, "activityKinds" | "lastActivityAt">
): HistoricoActivityKind[] {
  const kinds: HistoricoActivityKind[] = [];

  if (record.orcamento) {
    kinds.push("orcamento");
  }

  if (record.checklistsChegada.length > 0) {
    kinds.push("che");
  }

  if (record.checklistsDevolucao.length > 0) {
    kinds.push("chd");
  }

  return kinds;
}

function shouldIncludeInHistorico(record: Omit<HistoricoRecord, "lastActivityAt">) {
  if (record.activityKinds.length > 0) {
    return true;
  }

  if (record.order.tab === "resultado") {
    return true;
  }

  return typeof record.order.quotedValue === "number" && record.order.quotedValue > 0;
}

export function buildHistoricoRecords(
  orders: ServiceOrder[],
  orcamentos: Orcamento[],
  checklistsChegada: ChecklistChegada[],
  checklistsDevolucao: ChecklistDevolucao[]
): HistoricoRecord[] {
  const records = orders
    .map((order) => {
      const partial = {
        order,
        orcamento: findOrcamentoForOrder(order, orcamentos),
        checklistsChegada: findChecklistsChegadaForOrder(order, checklistsChegada),
        checklistsDevolucao: findChecklistsDevolucaoForOrder(
          order,
          checklistsDevolucao
        ),
        activityKinds: [] as HistoricoActivityKind[],
      };

      partial.activityKinds = resolveActivityKinds(partial);

      if (!shouldIncludeInHistorico(partial)) {
        return null;
      }

      return {
        ...partial,
        lastActivityAt: resolveLastActivityAt(partial),
      };
    })
    .filter((record): record is HistoricoRecord => record !== null);

  return records.sort((left, right) => {
    const leftTime = left.lastActivityAt
      ? new Date(left.lastActivityAt).getTime()
      : 0;
    const rightTime = right.lastActivityAt
      ? new Date(right.lastActivityAt).getTime()
      : 0;

    return rightTime - leftTime;
  });
}

export function filterHistoricoRecords(
  records: HistoricoRecord[],
  search: string
) {
  const query = search.trim().toLowerCase();

  if (!query) {
    return records;
  }

  return records.filter((record) => {
    const { order } = record;

    return (
      order.code.toLowerCase().includes(query) ||
      order.client.toLowerCase().includes(query) ||
      order.machine.toLowerCase().includes(query) ||
      order.relato?.toLowerCase().includes(query) ||
      record.orcamento?.protocol.toLowerCase().includes(query) ||
      record.checklistsChegada.some(
        (item) =>
          item.number.toLowerCase().includes(query) ||
          item.identification.client?.toLowerCase().includes(query)
      ) ||
      record.checklistsDevolucao.some((item) =>
        item.number.toLowerCase().includes(query)
      )
    );
  });
}

export function findHistoricoRecordByOrderId(
  data: HistoricoOficinaData,
  orderId: string
) {
  const normalized = normalizeToken(orderId);

  return (
    data.records.find(
      (record) =>
        normalizeToken(record.order.id) === normalized ||
        normalizeToken(record.order.code) === normalized
    ) ?? null
  );
}
