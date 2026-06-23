"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { staggerItem } from "@/shared/motion/presets";
import { serviceOrdersPageConfig } from "../config/page";
import { resultadoPageConfig } from "../config/resultado";
import { getOrdersByTab } from "../data/service-orders";
import type { ServiceOrder } from "../types/service-order";
import { ResultadoCard } from "./resultado-card";

function filterResultadoOrders(orders: ServiceOrder[], search: string) {
  const resultadoOrders = getOrdersByTab(orders, "resultado");
  const query = search.trim().toLowerCase();

  if (!query) return resultadoOrders;

  return resultadoOrders.filter(
    (order) =>
      order.code.toLowerCase().includes(query) ||
      order.client.toLowerCase().includes(query) ||
      order.machine.toLowerCase().includes(query) ||
      order.relato?.toLowerCase().includes(query)
  );
}

type ResultadoTabPanelProps = {
  active: boolean;
  search: string;
  orders: ServiceOrder[];
  isLoading: boolean;
};

export function ResultadoTabPanel({
  active,
  search,
  orders,
  isLoading,
}: ResultadoTabPanelProps) {
  const filteredOrders = useMemo(
    () => filterResultadoOrders(orders, search),
    [orders, search]
  );

  if (!active) return null;

  if (filteredOrders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500 shadow-sm">
        {isLoading
          ? serviceOrdersPageConfig.messages.loading
          : resultadoPageConfig.empty}
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
          <ResultadoCard order={order} />
        </motion.div>
      ))}
    </motion.div>
  );
}
