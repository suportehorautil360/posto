import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  labelClassName?: string;
};

export function TextField({
  label,
  id,
  className = "",
  labelClassName,
  ...props
}: TextFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className={cn("text-xs font-medium text-zinc-500", labelClassName)}
      >
        {label}
      </label>
      <Input
        id={fieldId}
        className={cn(
          "h-11 rounded-lg border-zinc-200 px-3 text-sm text-zinc-900 focus-visible:border-brand-navy focus-visible:ring-brand-navy/10",
          className,
        )}
        {...props}
      />
    </div>
  );
}
