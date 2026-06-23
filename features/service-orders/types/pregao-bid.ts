export type PregaoBidStatus = "submitted" | "pending";

export type PregaoBid = {
  id: string;
  oficinaId: string;
  oficinaName: string;
  leadTimeDays: number | null;
  value: number | null;
  status: PregaoBidStatus;
  isCurrentUser: boolean;
};
