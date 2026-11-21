"use client";

import React from "react";

export type StatusTone = "active" | "idle" | "danger";

export interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  pulse?: boolean;
  className?: string;
}

const toneStyles: Record<
  StatusTone,
  { wrapper: string; dot: string }
> = {
  active: {
    wrapper: "border-border-structural bg-surface/80 text-cyan-core",
    dot: "bg-cyan-core shadow-[0_0_8px_rgba(121,221,244,0.8)]",
  },
  idle: {
    wrapper: "border-border-dormant bg-chassis text-slate-hud",
    dot: "bg-muted-hud",
  },
  danger: {
    wrapper: "border-danger/40 bg-danger-bg text-danger",
    dot: "bg-danger",
  },
};

export function StatusBadge({
  label,
  tone = "idle",
  pulse = false,
  className = "",
}: StatusBadgeProps) {
  const styles = toneStyles[tone];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase transition-colors duration-200 ${styles.wrapper} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${styles.dot} ${
          pulse ? "animate-pulse" : ""
        }`}
      />
      {label}
    </span>
  );
}