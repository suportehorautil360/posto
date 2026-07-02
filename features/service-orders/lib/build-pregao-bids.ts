import { pregaoPageConfig } from "../config/pregao";
import { anonymizeCompetitorBids } from "./anonymize-pregao-bids";
import type { SolicitacaoOs, SolicitacaoOsLance } from "../types/solicitacao-os";
import type { PregaoBid } from "../types/pregao-bid";

type CurrentOficina = {
  id: string;
  name: string;
};

function createBid(
  bid: Omit<PregaoBid, "id"> & { id?: string }
): PregaoBid {
  return {
    id: bid.id ?? `${bid.oficinaId}-${bid.status}`,
    oficinaId: bid.oficinaId,
    oficinaName: bid.oficinaName,
    leadTimeDays: bid.leadTimeDays,
    value: bid.value,
    status: bid.status,
    isCurrentUser: bid.isCurrentUser,
  };
}

function mapLanceToBid(
  lance: SolicitacaoOsLance,
  currentOficinaId: string
): PregaoBid {
  const hasValue = typeof lance.valor === "number";
  const isCurrentUser = lance.oficinaId === currentOficinaId;

  return createBid({
    id: lance.oficinaId,
    oficinaId: lance.oficinaId,
    oficinaName: "",
    leadTimeDays:
      typeof lance.prazoDias === "number" ? lance.prazoDias : null,
    value: hasValue ? lance.valor! : null,
    status: hasValue ? "submitted" : "pending",
    isCurrentUser,
  });
}

function collectCompetitorIds(
  solicitacao: SolicitacaoOs,
  currentOficinaId: string
): string[] {
  const ids = new Set<string>();

  for (const oficinaId of solicitacao.oficinasIds ?? []) {
    if (oficinaId && oficinaId !== currentOficinaId) {
      ids.add(oficinaId);
    }
  }

  for (const lance of solicitacao.lances ?? []) {
    if (lance.oficinaId && lance.oficinaId !== currentOficinaId) {
      ids.add(lance.oficinaId);
    }
  }

  return [...ids];
}

function buildCompetitorBid(
  oficinaId: string,
  lance: SolicitacaoOsLance | undefined,
  currentOficinaId: string
): PregaoBid {
  if (lance) {
    return mapLanceToBid(lance, currentOficinaId);
  }

  return createBid({
    id: oficinaId,
    oficinaId,
    oficinaName: "",
    leadTimeDays: null,
    value: null,
    status: "pending",
    isCurrentUser: false,
  });
}

function sortCompetitorBids(bids: PregaoBid[]): PregaoBid[] {
  return [...bids].sort((a, b) => {
    const aSubmitted = a.status === "submitted" && a.value !== null;
    const bSubmitted = b.status === "submitted" && b.value !== null;

    if (aSubmitted && bSubmitted) {
      return (a.value ?? 0) - (b.value ?? 0);
    }

    if (aSubmitted) return -1;
    if (bSubmitted) return 1;

    return 0;
  });
}

function buildDemoCompetitors(
  userValue: number | null,
  currentOficinaId: string
): PregaoBid[] {
  const baseValue = userValue ?? 8200;
  const lowestValue = Math.round(baseValue * 0.91);

  return [
    createBid({
      id: "demo-competitor-1",
      oficinaId: "demo-competitor-1",
      oficinaName: "",
      leadTimeDays: 10,
      value: lowestValue,
      status: "submitted",
      isCurrentUser: false,
    }),
    createBid({
      id: "demo-competitor-2",
      oficinaId: "demo-competitor-2",
      oficinaName: "",
      leadTimeDays: null,
      value: null,
      status: "pending",
      isCurrentUser: false,
    }),
  ].filter((bid) => bid.oficinaId !== currentOficinaId);
}

export function buildPregaoBids(
  solicitacao: SolicitacaoOs,
  currentOficina: CurrentOficina,
  userValue: number | null,
  userLeadTimeDays: number | null = null
): PregaoBid[] {
  const userBid = createBid({
    id: currentOficina.id,
    oficinaId: currentOficina.id,
    oficinaName: currentOficina.name,
    leadTimeDays: userLeadTimeDays,
    value: userValue,
    status: userValue !== null ? "submitted" : "pending",
    isCurrentUser: true,
  });

  const lancesById = new Map(
    (solicitacao.lances ?? []).map((lance) => [lance.oficinaId, lance])
  );

  const competitorIds = collectCompetitorIds(solicitacao, currentOficina.id);

  if (competitorIds.length > 0) {
    const competitorBids = sortCompetitorBids(
      competitorIds.map((oficinaId) =>
        buildCompetitorBid(oficinaId, lancesById.get(oficinaId), currentOficina.id)
      )
    );

    return anonymizeCompetitorBids([userBid, ...competitorBids]);
  }

  if (pregaoPageConfig.fillDemoCompetitors) {
    return anonymizeCompetitorBids([
      userBid,
      ...buildDemoCompetitors(userValue, currentOficina.id),
    ]);
  }

  return [userBid];
}
