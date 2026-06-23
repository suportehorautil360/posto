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

function buildFromInvitedOficinas(
  solicitacao: SolicitacaoOs,
  currentOficina: CurrentOficina
): PregaoBid[] {
  const ids = solicitacao.oficinasIds ?? [];
  const responded = new Set(solicitacao.oficinasResponderam ?? []);

  return ids
    .map((oficinaId) => {
      if (oficinaId === currentOficina.id) return null;

      const hasResponded = responded.has(oficinaId);

      return createBid({
        id: oficinaId,
        oficinaId,
        oficinaName: "",
        leadTimeDays: null,
        value: null,
        status: hasResponded ? "pending" : "pending",
        isCurrentUser: false,
      });
    })
    .filter((bid): bid is PregaoBid => bid !== null);
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

  const lances = solicitacao.lances ?? [];
  const mappedLances = lances
    .map((lance) => mapLanceToBid(lance, currentOficina.id))
    .filter((bid) => !bid.isCurrentUser);

  if (mappedLances.length > 0) {
    return anonymizeCompetitorBids([userBid, ...mappedLances]);
  }

  const invitedBids = buildFromInvitedOficinas(solicitacao, currentOficina);

  if (invitedBids.length > 0) {
    return anonymizeCompetitorBids([userBid, ...invitedBids]);
  }

  if (pregaoPageConfig.fillDemoCompetitors) {
    return anonymizeCompetitorBids([
      userBid,
      ...buildDemoCompetitors(userValue, currentOficina.id),
    ]);
  }

  return [userBid];
}
