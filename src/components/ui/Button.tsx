"use client";

import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border-cyan-core/60 bg-cyan-deep/50 text-cyan-core hover:bg-cyan-deep/80 hover:border-cyan-core shadow-mind-sm",
  secondary:
    "border-border-structural bg-surface text-spectral hover:bg-surface-hover hover:border-cyan-core/50",
  danger:
    "border-danger/40 bg-danger-bg text-danger hover:bg-danger/20 hover:border-danger",
  ghost:
    "border-transparent bg-transparent text-slate-hud hover:text-spectral hover:bg-surface/60",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
};

export function Button({
  variant = "secondary",
  size = "sm",
  active = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md border font-medium tracking-wide transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-core disabled:pointer-events-none disabled:opacity-40 cursor-pointer ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${
        active ? "border-cyan-core bg-cyan-deep/70 text-cyan-core shadow-mind-sm" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}