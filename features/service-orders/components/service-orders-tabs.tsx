"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { CreateOrderFormPayload } from "../lib/map-create-order";
import type { ServiceOrder, ServiceOrderTab } from "../types/service-order";
import { useServiceOrders } from "../context/service-orders-context";
import { OrderStatusBadge } from "./order-status-badge";
import { CreateServiceOrderDialog } from "./create-service-order-dialog";

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

function OrdersTable({ orders }: { orders: ServiceOrder[] }) {
  return (
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
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="h-8 bg-brand-orange px-3 text-white hover:bg-brand-orange-hover"
                    >
                      {serviceOrdersPageConfig.actions.fixQuote}
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      className="text-zinc-500"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
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
      order.machine.toLowerCase().includes(query)
  );
}

function AnimatedTabPanel({
  tab,
  activeTab,
  search,
  orders,
}: {
  tab: ServiceOrderTab;
  activeTab: ServiceOrderTab;
  search: string;
  orders: ServiceOrder[];
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
          <OrdersTable orders={filteredOrders} />
        </motion.div>
      ) : null}
    </TabsContent>
  );
}

export function ServiceOrdersTabs() {
  const { orders, addOrder } = useServiceOrders();
  const [activeTab, setActiveTab] = useState<ServiceOrderTab>("recebidas");
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const counts = getTabCounts(orders);

  function handleCreateOrder(payload: CreateOrderFormPayload) {
    addOrder(payload);
    setActiveTab("recebidas");
    setSearch("");
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
      </TabsList>

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
        <Button
          className="h-11 bg-brand-orange px-4 text-white hover:bg-brand-orange-hover"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="size-4" />
          {serviceOrdersPageConfig.registerReceivedLabel}
        </Button>
      </div>

      <CreateServiceOrderDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        orders={orders}
        onSave={handleCreateOrder}
      />

      <AnimatedTabPanel
        tab="recebidas"
        activeTab={activeTab}
        search={search}
        orders={orders}
      />
      <AnimatedTabPanel tab="pregao" activeTab={activeTab} search={search} orders={orders} />
    </Tabs>
  );
}
