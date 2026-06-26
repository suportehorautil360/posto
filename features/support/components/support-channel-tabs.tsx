"use client";

import { cn } from "@/lib/utils";
import { supportChannels } from "../config/page";
import type { SupportChannel } from "../types/support";

type SupportChannelTabsProps = {
  value: SupportChannel;
  onChange: (channel: SupportChannel) => void;
};

export function SupportChannelTabs({
  value,
  onChange,
}: SupportChannelTabsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(Object.keys(supportChannels) as SupportChannel[]).map((channel) => {
        const config = supportChannels[channel];
        const Icon = config.icon;
        const active = value === channel;

        return (
          <button
            key={channel}
            type="button"
            onClick={() => onChange(channel)}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all",
              active
                ? "border-brand-orange bg-brand-orange/5 shadow-sm ring-1 ring-brand-orange/30"
                : "border-zinc-200/80 bg-white hover:border-zinc-300 hover:bg-zinc-50"
            )}
          >
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                active
                  ? "bg-brand-orange text-white"
                  : "bg-brand-navy/10 text-brand-navy"
              )}
            >
              <Icon className="size-5" />
            </span>
            <span>
              <span
                className={cn(
                  "block text-sm font-bold",
                  active ? "text-brand-navy" : "text-zinc-700"
                )}
              >
                {config.label}
              </span>
              <span className="mt-0.5 block text-xs text-zinc-500">
                {config.subtitle}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
