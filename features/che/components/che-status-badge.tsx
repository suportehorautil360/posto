import { cn } from "@/lib/utils";
import { getInspectionStatusLabel } from "../lib/format-checklist-meta";

type CheStatusBadgeProps = {
  status: string;
  className?: string;
};

export function CheStatusBadge({ status, className }: CheStatusBadgeProps) {
  const label = getInspectionStatusLabel(status);

  if (!status) {
    return <span className="text-zinc-400">—</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        status === "ok" && "bg-emerald-50 text-emerald-700",
        (status === "anomaly" || status === "anomalia") &&
          "bg-orange-50 text-orange-700",
        status === "na" && "bg-zinc-100 text-zinc-600",
        className
      )}
    >
      {label}
    </span>
  );
}
