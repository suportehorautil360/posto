"use client";

import { motion } from "framer-motion";
import { serviceOrdersPageConfig } from "../config/page";
import { ServiceOrdersTabs } from "./service-orders-tabs";

export function ServiceOrdersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full flex-col gap-8 px-8 py-8"
    >
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
        {serviceOrdersPageConfig.title}
      </h1>

      <ServiceOrdersTabs />
    </motion.div>
  );
}
