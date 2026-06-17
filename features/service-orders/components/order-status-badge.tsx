import type { ServiceOrderStatus } from "../types/service-order";
import { statusLabels } from "../config/page";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<ServiceOrderStatus, string> = {
  recebida: "border-sky-200 bg-sky-50 text-sky-700",
  "em-andamento": "border-blue-200 bg-blue-50 text-blue-700",
  "aguardando-peca": "border-violet-200 bg-violet-50 text-violet-700",
  "em-pregao": "border-amber-200 bg-amber-50 text-amber-700",
};

type OrderStatusBadgeProps = {
  status: ServiceOrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2.5 font-medium", statusStyles[status])}
    >
      {statusLabels[status]}
    </Badge>
  );
}
