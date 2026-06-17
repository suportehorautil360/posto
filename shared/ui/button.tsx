import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand-orange px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-hover disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
