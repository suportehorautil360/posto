"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supportPageConfig, supportChannels } from "../config/page";
import { useSupport } from "../context/support-context";
import {
  formatMessageTime,
} from "../lib/support-messages";
import type { SupportMessage } from "../types/support";

function MessageBubble({ message }: { message: SupportMessage }) {
  const isUser = message.sender === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "rounded-br-md bg-brand-navy text-white"
            : "rounded-bl-md border border-zinc-200/80 bg-white text-zinc-800"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.text}
        </p>
        <p
          className={cn(
            "mt-2 text-[11px]",
            isUser ? "text-white/60" : "text-zinc-400"
          )}
        >
          {formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

export function SupportChatPanel() {
  const { activeChannel, messages, sendMessage, isLoading, isSending } =
    useSupport();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const channel = supportChannels[activeChannel];
  const ChannelIcon = channel.icon;

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [messages, activeChannel]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!draft.trim()) {
      return;
    }

    try {
      await sendMessage(draft);
      setDraft("");
    } catch {
      // toast já exibido no contexto
    }
  }

  return (
    <section className="flex min-h-[520px] flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-zinc-200/80 bg-zinc-50/80 px-5 py-4">
        <span className="flex size-10 items-center justify-center rounded-xl bg-brand-navy text-white">
          <ChannelIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-brand-navy">{channel.label}</h2>
          <p className="text-sm text-zinc-500">{channel.subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          <span className="size-2 rounded-full bg-emerald-500" />
          {supportPageConfig.onlineLabel}
        </span>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <div className="flex justify-center">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {supportPageConfig.todayLabel}
          </span>
        </div>

        {isLoading ? (
          <p className="text-center text-sm text-zinc-500">
            {supportPageConfig.states.loading}
          </p>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-zinc-200/80 bg-white px-4 py-4"
      >
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={supportPageConfig.inputPlaceholder}
            className="h-11 border-zinc-200 bg-zinc-50/80 focus-visible:border-brand-orange focus-visible:ring-brand-orange/20"
          />
          <Button
            type="submit"
            disabled={!draft.trim() || isSending || isLoading}
            className="h-11 shrink-0 bg-brand-orange px-4 text-white hover:bg-brand-orange-hover"
            aria-label={supportPageConfig.sendLabel}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </form>
    </section>
  );
}
