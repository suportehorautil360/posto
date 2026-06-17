"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { chdPageConfig, chdTabs, chdTabOrder } from "../config/page";
import { getInitialClosingForm, getInitialGeneralStateForm, getInitialIdentificationForm, getInitialModulesForm, getInitialPartsForm, getInitialServicesForm } from "../lib/form-defaults";
import { saveChdChecklist } from "../lib/save-checklist";
import type { ChdFormState, ChdTabId } from "../types/form";
import { ChdHeader } from "./chd-header";
import { GeneralStateTab } from "./tabs/general-state-tab";
import { IdentificationTab } from "./tabs/identification-tab";
import { ModulesTab } from "./tabs/modules-tab";
import { PartsTab } from "./tabs/parts-tab";
import { ServicesTab } from "./tabs/services-tab";
import { ClosingTab } from "./tabs/closing-tab";

export function ChdPage() {
  const [activeTab, setActiveTab] = useState<ChdTabId>("identificacao");
  const [form, setForm] = useState<ChdFormState>({
    identification: getInitialIdentificationForm(),
    generalState: getInitialGeneralStateForm(),
    modules: getInitialModulesForm(),
    parts: getInitialPartsForm(),
    services: getInitialServicesForm(),
    closing: getInitialClosingForm(),
  });

  const [isSaving, setIsSaving] = useState(false);

  const currentTabIndex = chdTabOrder.indexOf(activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === chdTabOrder.length - 1;

  function handleBack() {
    if (isFirstTab) return;

    setActiveTab(chdTabOrder[currentTabIndex - 1] as ChdTabId);
  }

  async function handlePrimaryAction() {
    if (isLastTab) {
      setIsSaving(true);

      try {
        const result = await saveChdChecklist(form);

        toast.success(chdPageConfig.messages.saveSuccess, {
          description: `${chdPageConfig.messages.saveSuccessDescription} ${result.number}.`,
        });
      } catch {
        toast.error(chdPageConfig.messages.saveError);
      } finally {
        setIsSaving(false);
      }

      return;
    }

    setActiveTab(chdTabOrder[currentTabIndex + 1] as ChdTabId);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-full flex-col px-8 py-8"
    >
      <ChdHeader />

      <Tabs value={activeTab} className="mt-8 flex flex-1 flex-col gap-6">
        <TabsList
          variant="line"
          className="h-auto min-h-11 w-full flex-wrap justify-start gap-x-5 gap-y-1 overflow-visible rounded-none border-b border-zinc-200 bg-transparent p-0"
        >
          {chdTabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            const isUpcoming = index > currentTabIndex;

            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                disabled
                className={cn(
                  "h-11 shrink-0 flex-none cursor-default rounded-none px-1 pb-3 opacity-100 after:bg-brand-orange disabled:opacity-100",
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

              <TabsContent value="estado-geral" className="mt-0">
                {activeTab === "estado-geral" ? (
                  <GeneralStateTab
                    value={form.generalState}
                    onChange={(generalState) =>
                      setForm((current) => ({ ...current, generalState }))
                    }
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="modulos" className="mt-0">
                {activeTab === "modulos" ? (
                  <ModulesTab
                    value={form.modules}
                    onChange={(modules) =>
                      setForm((current) => ({ ...current, modules }))
                    }
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="pecas" className="mt-0">
                {activeTab === "pecas" ? (
                  <PartsTab
                    value={form.parts}
                    onChange={(parts) =>
                      setForm((current) => ({ ...current, parts }))
                    }
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="servicos" className="mt-0">
                {activeTab === "servicos" ? (
                  <ServicesTab
                    value={form.services}
                    onChange={(services) =>
                      setForm((current) => ({ ...current, services }))
                    }
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="encerramento" className="mt-0">
                {activeTab === "encerramento" ? (
                  <ClosingTab
                    value={form.closing}
                    onChange={(closing) =>
                      setForm((current) => ({ ...current, closing }))
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
            {chdPageConfig.actions.back}
          </Button>
        ) : null}
        <Button
          className="h-10 bg-brand-orange px-5 text-white hover:bg-brand-orange-hover"
          onClick={handlePrimaryAction}
          disabled={isSaving}
        >
          {isSaving
            ? chdPageConfig.actions.saving
            : isLastTab
              ? chdPageConfig.actions.save
              : chdPageConfig.actions.next}
          {!isLastTab && !isSaving ? <ChevronRight className="size-4" /> : null}
        </Button>
      </motion.div>
    </motion.div>
  );
}
