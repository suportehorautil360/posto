"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { getSupportMessages } from "../api/get-support-messages";
import { patchSupportMessagesRead } from "../api/patch-support-messages-read";
import { postSupportMessage } from "../api/post-support-message";
import { supportChannels } from "../config/page";
import { createInitialMessages } from "../lib/support-messages";
import type { SupportChannel, SupportMessage } from "../types/support";

type StoredMessages = Record<SupportChannel, SupportMessage[]>;

function buildFallbackMessages(): StoredMessages {
  return {
    financeiro: createInitialMessages("financeiro"),
    ti: createInitialMessages("ti"),
  };
}

type SupportContextValue = {
  activeChannel: SupportChannel;
  setActiveChannel: (channel: SupportChannel) => void;
  messages: SupportMessage[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  isSending: boolean;
};

const SupportContext = createContext<SupportContextValue | null>(null);

type SupportProviderProps = {
  oficinaId?: string;
  children: ReactNode;
};

export function SupportProvider({ oficinaId, children }: SupportProviderProps) {
  const [activeChannel, setActiveChannel] = useState<SupportChannel>("ti");
  const [messagesByChannel, setMessagesByChannel] =
    useState<StoredMessages>(buildFallbackMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loadChannel = useCallback(
    async (channel: SupportChannel) => {
      if (!oficinaId) {
        setMessagesByChannel(buildFallbackMessages());
        return;
      }

      setIsLoading(true);

      try {
        const messages = await getSupportMessages(oficinaId, channel);
        setMessagesByChannel((current) => ({
          ...current,
          [channel]: messages,
        }));

        try {
          await patchSupportMessagesRead(oficinaId, channel);
        } catch {
          // Marcar como lido não deve impedir o chat de abrir.
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o chat de suporte."
        );
        setMessagesByChannel((current) => ({
          ...current,
          [channel]: createInitialMessages(channel),
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [oficinaId]
  );

  useEffect(() => {
    void loadChannel(activeChannel);
  }, [activeChannel, loadChannel]);

  const handleSetActiveChannel = useCallback((channel: SupportChannel) => {
    setActiveChannel(channel);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();

      if (!trimmed || !oficinaId) {
        return;
      }

      setIsSending(true);

      try {
        const newMessages = await postSupportMessage({
          channel: activeChannel,
          text: trimmed,
        });

        setMessagesByChannel((current) => ({
          ...current,
          [activeChannel]: mergeMessages(current[activeChannel], newMessages),
        }));
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Não foi possível enviar a mensagem."
        );
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [activeChannel, oficinaId]
  );

  const value = useMemo(
    () => ({
      activeChannel,
      setActiveChannel: handleSetActiveChannel,
      messages: messagesByChannel[activeChannel],
      sendMessage,
      isLoading,
      isSending,
    }),
    [
      activeChannel,
      handleSetActiveChannel,
      isLoading,
      isSending,
      messagesByChannel,
      sendMessage,
    ]
  );

  return (
    <SupportContext.Provider value={value}>{children}</SupportContext.Provider>
  );
}

function mergeMessages(
  current: SupportMessage[],
  incoming: SupportMessage[]
): SupportMessage[] {
  const map = new Map<string, SupportMessage>();

  for (const message of current) {
    map.set(message.id, message);
  }

  for (const message of incoming) {
    map.set(message.id, message);
  }

  return [...map.values()].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );
}

export function useSupport() {
  const context = useContext(SupportContext);

  if (!context) {
    throw new Error("useSupport deve ser usado dentro de SupportProvider.");
  }

  return context;
}

export { supportChannels };
