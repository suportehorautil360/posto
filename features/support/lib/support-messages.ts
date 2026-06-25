import { supportChannels } from "../config/page";
import type { SupportChannel, SupportMessage } from "../types/support";

function createWelcomeMessage(channel: SupportChannel): SupportMessage {
  return {
    id: `welcome-${channel}`,
    channel,
    sender: "support",
    text: supportChannels[channel].welcomeMessage,
    createdAt: new Date().toISOString(),
  };
}

export function createInitialMessages(channel: SupportChannel): SupportMessage[] {
  return [createWelcomeMessage(channel)];
}

export function formatMessageTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function createUserMessage(
  channel: SupportChannel,
  text: string
): SupportMessage {
  return {
    id: crypto.randomUUID(),
    channel,
    sender: "user",
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
}

export function createSupportReply(
  channel: SupportChannel,
  text: string
): SupportMessage {
  return {
    id: crypto.randomUUID(),
    channel,
    sender: "support",
    text,
    createdAt: new Date().toISOString(),
  };
}

const autoReplies: Record<SupportChannel, string> = {
  financeiro:
    "Recebemos sua mensagem. Nossa equipe financeira vai responder em breve.",
  ti: "Recebemos sua mensagem. A equipe de TI vai analisar e retornar em breve.",
};

export function getAutoReply(channel: SupportChannel) {
  return autoReplies[channel];
}
