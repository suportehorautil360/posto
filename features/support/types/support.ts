export type SupportChannel = "financeiro" | "ti";

export type SupportMessageSender = "user" | "support";

export type SupportMessage = {
  id: string;
  oficinaId?: string;
  channel: SupportChannel;
  sender: SupportMessageSender;
  text: string;
  createdAt: string;
  readAt?: string | null;
};
