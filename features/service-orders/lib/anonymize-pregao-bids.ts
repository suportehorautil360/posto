import { pregaoPageConfig } from "../config/pregao";
import type { PregaoBid } from "../types/pregao-bid";

export function getPregaoBidDisplayName(
  bid: PregaoBid,
  competitorIndex: number
): string {
  if (bid.isCurrentUser) {
    return bid.oficinaName;
  }

  return pregaoPageConfig.competitorName(competitorIndex);
}

export function anonymizeCompetitorBids(bids: PregaoBid[]): PregaoBid[] {
  let competitorIndex = 0;

  return bids.map((bid) => {
    if (bid.isCurrentUser) {
      return bid;
    }

    competitorIndex += 1;

    return {
      ...bid,
      oficinaName: pregaoPageConfig.competitorName(competitorIndex),
    };
  });
}
