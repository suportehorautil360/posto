export type ServiceOrderOutcome = "won" | "lost" | "rejected";

export type ServiceOrderResultado = {
  outcome: ServiceOrderOutcome;
  approvedValue: number | null;
  approvedAt: string | null;
  yourBidValue: number | null;
};
