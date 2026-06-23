"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { staggerItem } from "@/shared/motion/presets";
import { serviceOrdersPageConfig } from "../config/page";
import { pregaoPageConfig } from "../config/pregao";
import { getOrdersByTab } from "../data/service-orders";
import type { ServiceOrder, ServiceOrderTab } from "../types/service-order";
import { PregaoCard } from "./pregao-card";

function filterPregaoOrders(orders: ServiceOrder[], search: string) {
  const pregaoOrders = getOrdersByTab(orders, "pregao");
  const query = search.trim().toLowerCase();

  if (!query) return pregaoOrders;

  return pregaoOrders.filter(
    (order) =>
      order.code.toLowerCase().includes(query) ||
      order.client.toLowerCase().includes(query) ||
      order.machine.toLowerCase().includes(query) ||
      order.relato?.toLowerCase().includes(query)
  );
}

type PregaoTabPanelProps = {
  active: boolean;
  search: string;
  orders: ServiceOrder[];
  isLoading: boolean;
};

export function PregaoTabPanel({
  active,
  search,
  orders,
  isLoading,
}: PregaoTabPanelProps) {
  const filteredOrders = useMemo(
    () => filterPregaoOrders(orders, search),
    [orders, search]
  );

  if (!active) return null;

  if (filteredOrders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
        {isLoading
          ? serviceOrdersPageConfig.messages.loading
          : pregaoPageConfig.empty}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-4"
    >
      {filteredOrders.map((order) => (
        <motion.div
          key={order.id}
          layout
          variants={staggerItem}
          initial="initial"
          animate="animate"
        >
          <PregaoCard order={order} />
        </motion.div>
      ))}
    </motion.div>
  );
}
