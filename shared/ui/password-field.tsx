"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  labelClassName?: string;
  toggleClassName?: string;
};

export function PasswordField({
  label,
  id,
  className = "",
  labelClassName,
  toggleClassName,
  disabled,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className={cn("text-xs font-medium text-zinc-500", labelClassName)}
      >
        {label}
      </label>
      <div className="relative">
        <Input
          id={fieldId}
          type={visible ? "text" : "password"}
          disabled={disabled}
          className={cn(
            "h-11 rounded-lg border-zinc-200 pr-11 text-sm text-zinc-900 focus-visible:border-brand-navy focus-visible:ring-brand-navy/10",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
          className={cn(
            "absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600 disabled:pointer-events-none disabled:opacity-50",
            toggleClassName,
          )}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden />
          ) : (
            <Eye className="size-4" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}
