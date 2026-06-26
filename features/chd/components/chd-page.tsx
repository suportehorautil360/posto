"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useQuotes } from "@/features/quotes/context/quotes-context";
import { resolveQuotePrefill } from "@/features/quotes/lib/resolve-quote-prefill";
import { ServiceOrderSelect } from "@/features/service-orders/components/service-order-select";
import { serviceOrderSelectConfig } from "@/features/service-orders/config/order-select";
import { useServiceOrders } from "@/features/service-orders/context/service-orders-context";
import { chdListPageConfig } from "../config/list";
import { chdPageConfig, chdTabs, chdTabOrder } from "../config/page";
import {
  buildInitialChdForm,
  getChdSaveOrderLinks,
} from "../lib/map-order-to-chd-form";
import {
  getInitialClosingForm,
  getInitialGeneralStateForm,
  getInitialIdentificationForm,
  getInitialModulesForm,
  getInitialPartsForm,
  getInitialServicesForm,
} from "../lib/form-defaults";
import { saveChdChecklist } from "../lib/save-checklist";
import {
  validateChdFormForSave,
  validateChdTab,
  clearChdTabFieldErrors,
  mergeChdFieldErrors,
} from "../lib/chd-validation";
import type { ChdFormState, ChdPartsForm, ChdTabId } from "../types/form";
import type { ChdFieldErrors } from "../types/validation";
import { ChdHeader } from "./chd-header";
import { ChecklistPrintButton } from "@/shared/components/checklist-print/checklist-print-button";
import { GeneralStateTab } from "./tabs/general-state-tab";
import { IdentificationTab } from "./tabs/identification-tab";
import { ModulesTab } from "./tabs/modules-tab";
import { PartsTab, type PartsTabHandle } from "./tabs/parts-tab";
import { ServicesTab } from "./tabs/services-tab";
import { ClosingTab } from "./tabs/closing-tab";

export function ChdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdFromQuery = searchParams.get("orderId");
  const { getOrderById, orders } = useServiceOrders();
  const { getQuote } = useQuotes();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orderIdFromQuery
  );
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
  const [fieldErrors, setFieldErrors] = useState<ChdFieldErrors>({});
  const [orderError, setOrderError] = useState<string | undefined>();
  const appliedQueryOrderRef = useRef<string | null>(null);
  const partsTabRef = useRef<PartsTabHandle>(null);

  const selectedOrder = selectedOrderId
    ? getOrderById(selectedOrderId)
    : undefined;

  function applyOrderPrefill(orderId: string) {
    const order = getOrderById(orderId);

    if (!order) return;

    const quote = resolveQuotePrefill(order, getQuote(orderId));
    setForm(buildInitialChdForm(order, quote));
  }

  useEffect(() => {
    if (!orderIdFromQuery) {
      appliedQueryOrderRef.current = null;
      return;
    }

    const order = getOrderById(orderIdFromQuery);

    if (!order) return;

    setSelectedOrderId(orderIdFromQuery);

    if (appliedQueryOrderRef.current === orderIdFromQuery) {
      return;
    }

    appliedQueryOrderRef.current = orderIdFromQuery;
    applyOrderPrefill(orderIdFromQuery);
  }, [orderIdFromQuery, getOrderById, orders, getQuote]);

  function handleOrderSelect(orderId: string | null) {
    setOrderError(undefined);
    setSelectedOrderId(orderId);
    appliedQueryOrderRef.current = orderId;

    if (!orderId) {
      setForm({
        identification: getInitialIdentificationForm(),
        generalState: getInitialGeneralStateForm(),
        modules: getInitialModulesForm(),
        parts: getInitialPartsForm(),
        services: getInitialServicesForm(),
        closing: getInitialClosingForm(),
      });
      return;
    }

    applyOrderPrefill(orderId);
  }

  const currentTabIndex = chdTabOrder.indexOf(activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === chdTabOrder.length - 1;

  function syncPartsDraft(showErrors = false): ChdPartsForm | null {
    if (!partsTabRef.current) {
      return form.parts;
    }

    return partsTabRef.current.flushDraft(showErrors);
  }

  function handleBack() {
    if (isFirstTab) return;

    if (activeTab === "pecas") {
      const syncedParts = syncPartsDraft();

      if (syncedParts) {
        setForm((current) => ({ ...current, parts: syncedParts }));
      }
    }

    setActiveTab(chdTabOrder[currentTabIndex - 1] as ChdTabId);
  }

  function getPartsDraft() {
    return partsTabRef.current?.getDraft();
  }

  function validateCurrentTab(formState: ChdFormState, tab: ChdTabId) {
    return validateChdTab(formState, tab, {
      partsDraft: tab === "pecas" ? getPartsDraft() : undefined,
    });
  }

  function ensureSelectedOrder() {
    if (selectedOrderId && selectedOrder) {
      return true;
    }

    setOrderError(serviceOrderSelectConfig.required);
    toast.error(serviceOrderSelectConfig.required);
    return false;
  }

  async function handlePrimaryAction() {
    if (!ensureSelectedOrder()) {
      return;
    }

    if (activeTab === "pecas" && !isLastTab) {
      const syncedParts = syncPartsDraft(true);

      if (syncedParts === null) {
        const draft = getPartsDraft();
        const partsValidation = validateChdTab(
          { ...form, parts: form.parts },
          "pecas",
          { partsDraft: draft }
        );

        if (partsValidation) {
          setFieldErrors(partsValidation.errors);
          toast.error(partsValidation.message);
        }

        return;
      }

      const partsValidation = validateChdTab(
        { ...form, parts: syncedParts },
        "pecas"
      );

      if (partsValidation) {
        setFieldErrors(partsValidation.errors);
        toast.error(partsValidation.message);
        return;
      }

      setFieldErrors((current) => clearChdTabFieldErrors(current, "pecas"));
      setForm((current) => ({ ...current, parts: syncedParts }));
      setActiveTab(chdTabOrder[currentTabIndex + 1] as ChdTabId);
      return;
    }

    if (isLastTab) {
      const syncedParts = syncPartsDraft(true);

      if (syncedParts === null) {
        const draft = getPartsDraft();
        const partsValidation = validateChdTab(
          { ...form, parts: form.parts },
          "pecas",
          { partsDraft: draft }
        );

        if (partsValidation) {
          setFieldErrors((current) =>
            mergeChdFieldErrors(current, partsValidation.errors)
          );
          setActiveTab("pecas");
          toast.error(partsValidation.message);
        }

        return;
      }

      const formToSave = { ...form, parts: syncedParts };
      const validation = validateChdFormForSave(formToSave, {
        partsDraft: getPartsDraft(),
      });

      if (validation) {
        setFieldErrors(validation.errors);
        toast.error(validation.message);
        setActiveTab(validation.tab);
        return;
      }

      setFieldErrors({});

      setIsSaving(true);

      try {
        const result = await saveChdChecklist(
          formToSave,
          getChdSaveOrderLinks(selectedOrder)
        );

        toast.success(chdPageConfig.messages.saveSuccess, {
          description: `${chdPageConfig.messages.saveSuccessDescription} ${result.number}.`,
        });
        router.push(`/chd/${result.id}`);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : chdPageConfig.messages.saveError
        );
      } finally {
        setIsSaving(false);
      }

      return;
    }

    const tabValidation = validateCurrentTab(form, activeTab);

    if (tabValidation) {
      setFieldErrors(tabValidation.errors);
      toast.error(tabValidation.message);
      return;
    }

    setFieldErrors((current) => clearChdTabFieldErrors(current, activeTab));

    setActiveTab(chdTabOrder[currentTabIndex + 1] as ChdTabId);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-full flex-col px-8 py-8"
    >
      <Link
        href="/chd"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-4 w-fit px-0 text-zinc-600 hover:text-brand-navy"
        )}
      >
        <ChevronLeft className="size-4" />
        {chdListPageConfig.actions.back}
      </Link>

      <ChdHeader orderCode={selectedOrder?.code} />

      <div className="mt-4 flex flex-wrap gap-3">
        <ChecklistPrintButton
          href="/chd/imprimir"
          orderId={selectedOrderId}
          label={chdPageConfig.actions.printForm}
        />
      </div>

      <div className="mt-6">
        <ServiceOrderSelect
          value={selectedOrderId}
          errorMessage={orderError}
          onValueChange={handleOrderSelect}
        />
      </div>

      <Tabs value={activeTab} className="mt-6 flex flex-1 flex-col gap-6">
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
                    errors={fieldErrors.identification}
                    onChange={(identification) => {
                      setFieldErrors((current) =>
                        clearChdTabFieldErrors(current, "identificacao")
                      );
                      setForm((current) => ({ ...current, identification }));
                    }}
                  />
                ) : null}
              </TabsContent>

              <TabsContent value="estado-geral" className="mt-0">
                {activeTab === "estado-geral" ? (
                  <GeneralStateTab
                    value={form.generalState}
                    errors={fieldErrors.generalState}
                    onChange={(generalState) => {
                      setFieldErrors((current) =>
                        clearChdTabFieldErrors(current, "estado-geral")
                      );
                      setForm((current) => ({ ...current, generalState }));
                    }}
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
                <div className={activeTab === "pecas" ? undefined : "hidden"}>
                  <PartsTab
                    ref={partsTabRef}
                    value={form.parts}
                    errors={fieldErrors.parts}
                    onChange={(parts) => {
                      setFieldErrors((current) =>
                        clearChdTabFieldErrors(current, "pecas")
                      );
                      setForm((current) => ({ ...current, parts }));
                    }}
                  />
                </div>
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
