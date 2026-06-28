"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { staggerItem } from "@/shared/motion/presets";
import { serviceOrdersPageConfig } from "../config/page";
import { getOrdersByTab, getTabCounts } from "../data/service-orders";
import {
  canCreateQuoteForOrder,
  getQuoteActionLabel,
} from "../lib/order-quote-action";
import type { ServiceOrder, ServiceOrderTab } from "../types/service-order";
import { useServiceOrders } from "../context/service-orders-context";
import { OrderStatusBadge } from "./order-status-badge";
import { PregaoOrderDetailsDialog } from "./pregao-order-details-dialog";
import { PregaoTabPanel } from "./pregao-tab-panel";
import { ResultadoTabPanel } from "./resultado-tab-panel";

function formatCurrency(value: number | null) {
  if (value === null) return "—";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function TabCountBadge({
  count,
  active,
}: {
  count: number;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none",
        active
          ? "bg-brand-orange text-white"
          : "bg-zinc-100 text-zinc-500"
      )}
    >
      {count}
    </span>
  );
}

function OrdersTable({
  orders,
  onQuoteAction,
  emptyMessage,
}: {
  orders: ServiceOrder[];
  onQuoteAction: (order: ServiceOrder) => void;
  emptyMessage?: string;
}) {
  const [detailsOrder, setDetailsOrder] = useState<ServiceOrder | null>(null);

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
        {emptyMessage ?? serviceOrdersPageConfig.messages.empty}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {Object.values(serviceOrdersPageConfig.columns).map((column) => (
              <TableHead
                key={column}
                className="h-11 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase"
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <motion.tr
              key={order.id}
              layout
              variants={staggerItem}
              initial="initial"
              animate="animate"
              className="border-b transition-colors hover:bg-zinc-50/70"
            >
                <TableCell className="py-4 font-semibold text-brand-navy">
                  {order.code}
                </TableCell>
                <TableCell className="py-4 text-zinc-700">
                  {order.client}
                </TableCell>
                <TableCell className="py-4 text-zinc-600">
                  {order.machine}
                </TableCell>
                <TableCell className="py-4 text-zinc-600">
                  {order.openedAt}
                </TableCell>
                <TableCell className="py-4">
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="py-4 font-medium text-zinc-700">
                  {formatCurrency(order.quotedValue)}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 border-zinc-200 bg-white px-3 text-zinc-700"
                      onClick={() => setDetailsOrder(order)}
                    >
                      {serviceOrdersPageConfig.actions.viewDetails}
                    </Button>
                    {canCreateQuoteForOrder(order) ? (
                      <Button
                        size="sm"
                        className="h-8 bg-brand-orange px-3 text-white hover:bg-brand-orange-hover"
                        onClick={() => onQuoteAction(order)}
                      >
                        {getQuoteActionLabel(order)}
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>

      {detailsOrder ? (
        <PregaoOrderDetailsDialog
          order={detailsOrder}
          open={detailsOrder !== null}
          onOpenChange={(open) => {
            if (!open) setDetailsOrder(null);
          }}
        />
      ) : null}
    </>
  );
}

function filterOrders(
  allOrders: ServiceOrder[],
  tab: ServiceOrderTab,
  search: string
) {
  const orders = getOrdersByTab(allOrders, tab);
  const query = search.trim().toLowerCase();

  if (!query) return orders;

  return orders.filter(
    (order) =>
      order.code.toLowerCase().includes(query) ||
      order.client.toLowerCase().includes(query) ||
      order.machine.toLowerCase().includes(query) ||
      order.relato?.toLowerCase().includes(query)
  );
}

function AnimatedTabPanel({
  tab,
  activeTab,
  search,
  orders,
  onQuoteAction,
  isLoading,
  emptyMessage,
}: {
  tab: ServiceOrderTab;
  activeTab: ServiceOrderTab;
  search: string;
  orders: ServiceOrder[];
  onQuoteAction: (order: ServiceOrder) => void;
  isLoading: boolean;
  emptyMessage?: string;
}) {
  const filteredOrders = useMemo(
    () => filterOrders(orders, tab, search),
    [orders, tab, search]
  );

  return (
    <TabsContent value={tab} className="mt-0">
      {activeTab === tab ? (
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <OrdersTable
            orders={filteredOrders}
            onQuoteAction={onQuoteAction}
            emptyMessage={
              isLoading
                ? serviceOrdersPageConfig.messages.loading
                : emptyMessage
            }
          />
        </motion.div>
      ) : null}
    </TabsContent>
  );
}

export function ServiceOrdersTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders, isLoading, error, refreshOrders } = useServiceOrders();
  const [activeTab, setActiveTab] = useState<ServiceOrderTab>("recebidas");
  const [search, setSearch] = useState("");
  const counts = getTabCounts(orders);

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab === "pregao" || tab === "recebidas" || tab === "resultado") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  function handleQuoteAction(order: ServiceOrder) {
    if (!canCreateQuoteForOrder(order)) {
      return;
    }

    router.push(`/orcamentos/novo?orderId=${order.id}`);
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as ServiceOrderTab)}
      className="gap-6"
    >
      <TabsList
        variant="line"
        className="h-auto w-full justify-start gap-6 rounded-none border-b border-zinc-200 bg-transparent p-0"
      >
        <TabsTrigger
          value="recebidas"
          className="h-11 rounded-none px-0 pb-3 after:bg-brand-orange data-active:text-brand-navy"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            {serviceOrdersPageConfig.tabs.recebidas}
            <TabCountBadge
              count={counts.recebidas}
              active={activeTab === "recebidas"}
            />
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="pregao"
          className="h-11 rounded-none px-0 pb-3 after:bg-brand-orange data-active:text-brand-navy"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            {serviceOrdersPageConfig.tabs.pregao}
            <TabCountBadge
              count={counts.pregao}
              active={activeTab === "pregao"}
            />
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="resultado"
          className="h-11 rounded-none px-0 pb-3 after:bg-brand-orange data-active:text-brand-navy"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            {serviceOrdersPageConfig.tabs.resultado}
            <TabCountBadge
              count={counts.resultado}
              active={activeTab === "resultado"}
            />
          </span>
        </TabsTrigger>
      </TabsList>

      <p className="text-sm text-zinc-500">
        {activeTab === "recebidas"
          ? serviceOrdersPageConfig.tabHints.recebidas
          : activeTab === "pregao"
            ? serviceOrdersPageConfig.tabHints.pregao
            : serviceOrdersPageConfig.tabHints.resultado}
      </p>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={serviceOrdersPageConfig.searchPlaceholder}
            className="h-11 border-zinc-200 bg-white pl-10 shadow-sm"
          />
        </div>
        {activeTab === "recebidas" ? (
          <Link
            href="/orcamentos"
            className={cn(
              buttonVariants(),
              "h-11 bg-brand-orange px-4 text-white hover:bg-brand-orange-hover"
            )}
          >
            <Plus className="size-4" />
            {serviceOrdersPageConfig.newQuoteLabel}
          </Link>
        ) : null}
      </div>

      {error ? (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-700">
            {error || serviceOrdersPageConfig.messages.loadError}
          </p>
          <Button
            type="button"
            variant="outline"
            className="h-9 border-red-200 bg-white text-red-700"
            onClick={() => void refreshOrders()}
          >
            {serviceOrdersPageConfig.messages.retry}
          </Button>
        </div>
      ) : null}

      <AnimatedTabPanel
        tab="recebidas"
        activeTab={activeTab}
        search={search}
        orders={orders}
        onQuoteAction={handleQuoteAction}
        isLoading={isLoading}
        emptyMessage={serviceOrdersPageConfig.messages.emptyRecebidas}
      />

      <TabsContent value="pregao" className="mt-0">
        <PregaoTabPanel
          active={activeTab === "pregao"}
          search={search}
          orders={orders}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="resultado" className="mt-0">
        <ResultadoTabPanel
          active={activeTab === "resultado"}
          search={search}
          orders={orders}
          isLoading={isLoading}
        />
      </TabsContent>

    </Tabs>
  );
}
