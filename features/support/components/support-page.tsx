"use client";

import { motion } from "framer-motion";
import { Headset } from "lucide-react";
import { useOficinaStore } from "@/features/auth/store/oficina-store";
import { supportPageConfig } from "../config/page";
import { useSupport } from "../context/support-context";
import { SupportChannelTabs } from "./support-channel-tabs";
import { SupportChatPanel } from "./support-chat-panel";

export function SupportPage() {
  const oficina = useOficinaStore((state) => state.oficina);
  const { activeChannel, setActiveChannel } = useSupport();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-8 py-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
            <Headset className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
              {supportPageConfig.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {supportPageConfig.subtitle}
            </p>
          </div>
        </div>
      </div>

      {!oficina?.id ? (
        <div className="rounded-xl border border-zinc-200/80 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
          {supportPageConfig.states.noOficina}
        </div>
      ) : (
        <>
          <SupportChannelTabs
            value={activeChannel}
            onChange={setActiveChannel}
          />
          <SupportChatPanel />
        </>
      )}
    </motion.div>
  );
}
