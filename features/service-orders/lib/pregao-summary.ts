import type { PregaoBid } from "../types/pregao-bid";

export type PregaoSummary = {
  lowestValue: number | null;
  highestValue: number | null;
  spread: number | null;
  userValue: number | null;
  aboveLowest: number | null;
  isUserLowest: boolean;
  lowestBidId: string | null;
};

export function getPregaoSummary(bids: PregaoBid[]): PregaoSummary {
  const submitted = bids.filter(
    (bid) => bid.status === "submitted" && bid.value !== null
  );
  const values = submitted.map((bid) => bid.value as number);
  const lowestValue = values.length > 0 ? Math.min(...values) : null;
  const highestValue = values.length > 0 ? Math.max(...values) : null;
  const spread =
    lowestValue !== null && highestValue !== null
      ? highestValue - lowestValue
      : null;

  const lowestBids = submitted.filter((bid) => bid.value === lowestValue);
  const lowestBidId = lowestBids[0]?.id ?? null;

  const userBid = bids.find((bid) => bid.isCurrentUser);
  const userValue = userBid?.value ?? null;
  const isUserLowest =
    userValue !== null &&
    lowestValue !== null &&
    userValue === lowestValue &&
    submitted.some((bid) => bid.isCurrentUser);

  const aboveLowest =
    userValue !== null && lowestValue !== null && userValue > lowestValue
      ? userValue - lowestValue
      : null;

  return {
    lowestValue,
    highestValue,
    spread,
    userValue,
    aboveLowest,
    isUserLowest,
    lowestBidId,
  };
}
