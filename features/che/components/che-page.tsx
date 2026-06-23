"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useQuotes } from "@/features/quotes/context/quotes-context";
import { resolveQuotePrefill } from "@/features/quotes/lib/resolve-quote-prefill";
import { useServiceOrders } from "@/features/service-orders/context/service-orders-context";
import { ServiceOrderSelect } from "@/features/service-orders/components/service-order-select";
import { cheListPageConfig } from "../config/list";
import { chePageConfig, cheTabs, cheTabOrder } from "../config/page";
import { getCheSaveOrderLinks } from "../lib/get-che-save-order-links";
import { cheFormSchema, type CheFormValues } from "../lib/che-form-schema";
import { cheTabFieldGroups } from "../lib/che-tab-fields";
import { resolveCheTabValidationMessage } from "../lib/che-validation-feedback";
import { buildInitialCheForm } from "../lib/map-order-to-che-form";
import { saveCheChecklist } from "../lib/save-checklist";
import type { CheTabId } from "../types/checklist";
import { CheHeader } from "./che-header";
import { BlocksTab } from "./tabs/blocks-tab";
import { IdentificationTab } from "./tabs/identification-tab";
import { InspectionTab } from "./tabs/inspection-tab";
import { PhotosTab } from "./tabs/photos-tab";
import { TermTab } from "./tabs/term-tab";

export function ChePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { getOrderById, orders } = useServiceOrders();
  const { getQuote } = useQuotes();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orderId);
  const selectedOrder = selectedOrderId
    ? getOrderById(selectedOrderId)
    : undefined;

  function getPrefillForOrder(selectedId: string | undefined) {
    if (!selectedId) return undefined;

    const linkedOrder = getOrderById(selectedId);

    if (!linkedOrder) return undefined;

    const quote = resolveQuotePrefill(linkedOrder, getQuote(selectedId));

    return { order: linkedOrder, quote };
  }

  const defaultValues = useMemo(() => {
    const prefill = getPrefillForOrder(selectedOrderId ?? undefined);

    return prefill
      ? buildInitialCheForm(prefill.order, prefill.quote)
      : buildInitialCheForm();
  }, [selectedOrderId, orders, getOrderById, getQuote]);

  const form = useForm<CheFormValues>({
    resolver: zodResolver(cheFormSchema) as Resolver<CheFormValues>,
    defaultValues,
    mode: "onTouched",
  });

  const [activeTab, setActiveTab] = useState<CheTabId>("identificacao");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  useEffect(() => {
    if (!orderId) return;

    const linkedOrder = getOrderById(orderId);

    if (!linkedOrder) return;

    setSelectedOrderId(orderId);
    const prefill = getPrefillForOrder(orderId);

    if (prefill) {
      form.reset(buildInitialCheForm(prefill.order, prefill.quote));
    }
  }, [orderId, getOrderById, orders, form, getQuote]);

  function handleOrderSelect(nextOrderId: string | null) {
    setSelectedOrderId(nextOrderId);

    if (!nextOrderId) {
      form.reset(buildInitialCheForm());
      return;
    }

    const prefill = getPrefillForOrder(nextOrderId);

    if (prefill) {
      form.reset(buildInitialCheForm(prefill.order, prefill.quote));
    }
  }

  const currentTabIndex = cheTabOrder.indexOf(activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === cheTabOrder.length - 1;

  function handleBack() {
    if (isFirstTab) return;

    setActiveTab(cheTabOrder[currentTabIndex - 1]);
  }

  async function onSubmit(values: CheFormValues) {
    setIsSaving(true);

    try {
      const result = await saveCheChecklist(values, getCheSaveOrderLinks(selectedOrder));

      toast.success(chePageConfig.messages.saveSuccess, {
        description: `${chePageConfig.messages.saveSuccessDescription} ${result.number}.`,
      });
      router.push(`/che/${result.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : chePageConfig.messages.saveError
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePrimaryAction() {
    const isValid = await form.trigger(cheTabFieldGroups[activeTab]);

    if (!isValid) {
      toast.error(
        resolveCheTabValidationMessage(activeTab, form.formState.errors)
      );
      return;
    }

    if (isLastTab) {
      await form.handleSubmit(onSubmit)();
      return;
    }

    setActiveTab(cheTabOrder[currentTabIndex + 1]);
  }

  return (
    <FormProvider {...form}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-full flex-col px-8 py-8"
      >
        <Link
          href="/che"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-4 w-fit px-0 text-zinc-600 hover:text-brand-navy"
          )}
        >
          <ChevronLeft className="size-4" />
          {cheListPageConfig.actions.back}
        </Link>

        <CheHeader orderCode={selectedOrder?.code} />

        <div className="mt-6">
          <ServiceOrderSelect
            value={selectedOrderId}
            onValueChange={handleOrderSelect}
          />
        </div>

        <Tabs
          value={activeTab}
          className="mt-6 flex flex-1 flex-col gap-6"
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
                  {activeTab === "identificacao" ? <IdentificationTab /> : null}
                </TabsContent>

                <TabsContent value="fotos" className="mt-0">
                  {activeTab === "fotos" ? <PhotosTab /> : null}
                </TabsContent>

                <TabsContent value="inspecao" className="mt-0">
                  {activeTab === "inspecao" ? <InspectionTab /> : null}
                </TabsContent>

                <TabsContent value="blocos" className="mt-0">
                  {activeTab === "blocos" ? <BlocksTab /> : null}
                </TabsContent>

                <TabsContent value="termo" className="mt-0">
                  {activeTab === "termo" ? <TermTab /> : null}
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
              type="button"
              variant="outline"
              className="h-10 border-zinc-200 bg-white px-5"
              onClick={handleBack}
            >
              <ChevronLeft className="size-4" />
              {chePageConfig.actions.back}
            </Button>
          ) : null}
          <Button
            type="button"
            className="h-10 bg-brand-orange px-5 text-white hover:bg-brand-orange-hover"
            onClick={() => void handlePrimaryAction()}
            disabled={isSaving}
          >
            {isSaving
              ? chePageConfig.actions.saving
              : isLastTab
                ? chePageConfig.actions.save
                : chePageConfig.actions.next}
            {!isLastTab && !isSaving ? <ChevronRight className="size-4" /> : null}
          </Button>
        </motion.div>
      </motion.div>
    </FormProvider>
  );
}
