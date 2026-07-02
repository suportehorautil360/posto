"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export type DeselectableRadioOption<T extends string> = {
  value: T;
  label?: string;
  id?: string;
  ariaLabel?: string;
};

type DeselectableRadioGroupProps<T extends string> = {
  value: T | "";
  onValueChange: (value: T | "") => void;
  options: DeselectableRadioOption<T>[];
  /** Grade OK / Anomalia / NA sem rótulo visível. */
  variant?: "status-grid" | "inline";
  className?: string;
  /** Prefixo do aria-label na grade de status (nome do item). */
  itemLabel?: string;
};

export function DeselectableRadioGroup<T extends string>({
  value,
  onValueChange,
  options,
  variant = "inline",
  className,
  itemLabel = "",
}: DeselectableRadioGroupProps<T>) {
  function handleToggle(optionValue: T) {
    if (value === optionValue) {
      onValueChange("");
    }
  }

  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onValueChange(next as T)}
      className={cn(
        variant === "status-grid" && "col-span-3 grid grid-cols-3",
        variant === "inline" && "flex flex-wrap gap-5 pt-1",
        className
      )}
    >
      {options.map((option) => {
        const id = option.id ?? `radio-${option.value}`;
        const ariaLabel =
          option.ariaLabel ??
          (itemLabel && option.label
            ? `${itemLabel} — ${option.label}`
            : option.label);

        if (variant === "status-grid") {
          return (
            <div key={option.value} className="flex justify-center">
              <RadioGroupItem
                value={option.value}
                aria-label={ariaLabel}
                onClick={() => handleToggle(option.value)}
              />
            </div>
          );
        }

        return (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem
              value={option.value}
              id={id}
              aria-label={ariaLabel}
              onClick={() => handleToggle(option.value)}
            />
            {option.label ? (
              <Label
                htmlFor={id}
                className="cursor-pointer text-sm font-medium text-zinc-700"
              >
                {option.label}
              </Label>
            ) : null}
          </div>
        );
      })}
    </RadioGroup>
  );
}
