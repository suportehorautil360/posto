"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { serviceOrderSelectConfig } from "../config/order-select";
import { useServiceOrders } from "../context/service-orders-context";
import { cn } from "@/lib/utils";
import {
  findServiceOrderById,
  formatServiceOrderOptionLabel,
  getSelectableServiceOrders,
  getServiceOrderDisplayName,
  serviceOrderSelectNoneValue,
} from "../lib/get-selectable-orders";
import type { ServiceOrder } from "../types/service-order";

type ServiceOrderSelectProps = {
  value: string | null;
  onValueChange: (orderId: string | null, order?: ServiceOrder) => void;
  allowEmpty?: boolean;
  label?: string;
  hint?: string;
  errorMessage?: string;
  filterOrder?: (order: ServiceOrder) => boolean;
};

export function ServiceOrderSelect({
  value,
  onValueChange,
  allowEmpty = true,
  label = serviceOrderSelectConfig.label,
  hint = serviceOrderSelectConfig.hint,
  errorMessage,
  filterOrder,
}: ServiceOrderSelectProps) {
  const { orders, isLoading, error } = useServiceOrders();
  const selectedOrder = value ? findServiceOrderById(orders, value) : undefined;
  const selectableOrders = useMemo(() => {
    let list = getSelectableServiceOrders(orders);

    if (filterOrder) {
      list = list.filter(filterOrder);
    }

    if (
      selectedOrder &&
      (!filterOrder || filterOrder(selectedOrder)) &&
      !list.some((order) => order.id === selectedOrder.id)
    ) {
      return [selectedOrder, ...list];
    }

    return list;
  }, [orders, selectedOrder, filterOrder]);
  const selectValue = value ?? serviceOrderSelectNoneValue;

  function handleValueChange(nextValue: string | null) {
    if (!nextValue || nextValue === serviceOrderSelectNoneValue) {
      onValueChange(null);
      return;
    }

    const order = findServiceOrderById(orders, nextValue);
    onValueChange(nextValue, order);
  }

  function getTriggerLabel() {
    if (selectValue === serviceOrderSelectNoneValue) {
      return serviceOrderSelectConfig.emptyOption;
    }

    if (selectedOrder) {
      return getServiceOrderDisplayName(selectedOrder);
    }

    return serviceOrderSelectConfig.placeholder;
  }

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
      <Label className="mb-2 block text-xs font-medium text-zinc-500">
        {label}
      </Label>

      {isLoading ? (
        <p className="text-sm text-zinc-500">{serviceOrderSelectConfig.loading}</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : selectableOrders.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {serviceOrderSelectConfig.emptyList}
        </p>
      ) : (
        <Select value={selectValue} onValueChange={handleValueChange}>
          <SelectTrigger
            className={cn(
              "h-11 w-full border-zinc-200",
              errorMessage && "border-red-300"
            )}
          >
            <span
              className={
                selectValue === serviceOrderSelectNoneValue && !selectedOrder
                  ? "truncate text-zinc-500"
                  : "truncate text-zinc-900"
              }
            >
              {getTriggerLabel()}
            </span>
          </SelectTrigger>
          <SelectContent>
            {allowEmpty ? (
              <SelectItem value={serviceOrderSelectNoneValue}>
                {serviceOrderSelectConfig.emptyOption}
              </SelectItem>
            ) : null}
            {selectableOrders.map((order) => (
              <SelectItem key={order.id} value={order.id}>
                {formatServiceOrderOptionLabel(order)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {errorMessage ? (
        <p className="mt-1.5 text-xs text-red-600">{errorMessage}</p>
      ) : hint ? (
        <p className="mt-2 text-xs text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}
