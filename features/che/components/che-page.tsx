"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { chePageConfig, cheTabs, cheTabOrder } from "../config/page";
import { getInitialBlocksForm, getInitialIdentificationForm, getInitialInspectionForm, getInitialPhotosForm, getInitialTermForm } from "../lib/form-defaults";
import type { CheFormState, CheTabId } from "../types/checklist";
import { CheHeader } from "./che-header";
import { BlocksTab } from "./tabs/blocks-tab";
import { IdentificationTab } from "./tabs/identification-tab";
import { InspectionTab } from "./tabs/inspection-tab";
import { PhotosTab } from "./tabs/photos-tab";
import { TermTab } from "./tabs/term-tab";

export function ChePage() {
  const [activeTab, setActiveTab] = useState<CheTabId>("identificacao");
  const [form, setForm] = useState<CheFormState>({
    identification: getInitialIdentificationForm(),
    photos: getInitialPhotosForm(),
    inspection: getInitialInspectionForm(),
    blocks: getInitialBlocksForm(),
    term: getInitialTermForm(),
  });

  const currentTabIndex = cheTabOrder.indexOf(activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === cheTabOrder.length - 1;

  function handleBack() {
    if (isFirstTab) return;

    setActiveTab(cheTabOrder[currentTabIndex - 1]);
  }

  function handlePrimaryAction() {
    if (isLastTab) {
      // TODO: integrar POST /checklists
      return;
    }

    const nextTab = cheTabOrder[currentTabIndex + 1];
    setActiveTab(nextTab);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-full flex-col px-8 py-8"
    >
      <CheHeader />

      <Tabs
        value={activeTab}
        className="mt-8 flex flex-1 flex-col gap-6"
      >
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-5 overflow-x-auto rounded-none border-b border-zinc-200 bg-transparent p-0"
        >
          {cheTabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            const isUpcoming = index > currentTabIndex;

            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                disabled
                className={cn(
                  "h-11 shrink-0 cursor-default rounded-none px-1 pb-3 opacity-100 after:bg-brand-navy disabled:opacity-100",
                  isActive && "text-brand-navy",
                  isUpcoming && "text-zinc-400",
                  !isActive && !isUpcoming && "text-zinc-600"
                )}
              >
                <span className="text-sm font-semibold">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <TabsContent value="identificacao" className="mt-0">
                {activeTab === "identificacao" ? (
                  <IdentificationTab
                    value={form.identification}
                    onChange={(identification) =>
                      setForm((current) => ({ ...current, identification }))
                    }
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="fotos" className="mt-0">
                {activeTab === "fotos" ? (
                  <PhotosTab
                    value={form.photos}
                    onChange={(photos) =>
                      setForm((current) => ({ ...current, photos }))
                    }
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="inspecao" className="mt-0">
                {activeTab === "inspecao" ? (
                  <InspectionTab
                    value={form.inspection}
                    onChange={(inspection) =>
                      setForm((current) => ({ ...current, inspection }))
                    }
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="blocos" className="mt-0">
                {activeTab === "blocos" ? (
                  <BlocksTab
                    value={form.blocks}
                    onChange={(blocks) =>
                      setForm((current) => ({ ...current, blocks }))
                    }
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="termo" className="mt-0">
                {activeTab === "termo" ? (
                  <TermTab
                    value={form.term}
                    onChange={(term) =>
                      setForm((current) => ({ ...current, term }))
                    }
                  />
                ) : null}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 flex justify-end gap-3"
      >
        {!isFirstTab ? (
          <Button
            variant="outline"
            className="h-10 border-zinc-200 bg-white px-5"
            onClick={handleBack}
          >
            <ChevronLeft className="size-4" />
            {chePageConfig.actions.back}
          </Button>
        ) : null}
        <Button
          className="h-10 bg-brand-orange px-5 text-white hover:bg-brand-orange-hover"
          onClick={handlePrimaryAction}
        >
          {isLastTab ? chePageConfig.actions.save : chePageConfig.actions.next}
          {!isLastTab ? <ChevronRight className="size-4" /> : null}
        </Button>
      </motion.div>
    </motion.div>
  );
}
