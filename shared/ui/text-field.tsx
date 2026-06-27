import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function TextField({
  label,
  id,
  className = "",
  ...props
}: TextFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className="text-xs font-medium text-zinc-500"
      >
        {label}
      </label>
      <Input
        id={fieldId}
        className={`h-11 rounded-lg border-zinc-200 px-3 text-sm text-zinc-900 focus-visible:border-brand-navy focus-visible:ring-brand-navy/10 ${className}`.trim()}
        {...props}
      />
    </div>
  );
}
