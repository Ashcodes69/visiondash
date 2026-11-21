"use client";

import React from "react";

export interface DisplayBoxProps {
  label: string;
  value: string;
  placeholder?: string;
  /** Optional buttons or badges rendered on the right side of the panel header */
  actions?: React.ReactNode;
  /** Use monospace styling for Morse signals vs clean sans for decoded text */
  monospace?: boolean;
  /** Highlights the border when actively receiving signals */
  active?: boolean;
  /** Minimum height class for the content area */
  minHeightClass?: string;
  className?: string;
}

export function DisplayBox({
  label,
  value,
  placeholder = "Waiting for input...",
  actions,
  monospace = false,
  active = false,
  minHeightClass = "min-h-[88px]",
  className = "",
}: DisplayBoxProps) {
  return (
    <section
      className={`flex flex-col rounded-lg border bg-chassis transition-colors duration-200 ${
        active
          ? "border-border-structural shadow-mind-sm"
          : "border-border-dormant"
      } ${className}`}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-border-dormant/80 px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-hud">
          {label}
        </span>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Content Readout Area */}
      <div
        className={`w-full overflow-y-auto px-4 py-3.5 ${minHeightClass} ${
          monospace
            ? "font-mono text-xl tracking-[0.25em] text-cyan-core"
            : "text-lg leading-relaxed tracking-wide text-spectral sm:text-xl"
        }`}
      >
        {value ? (
          <p className="whitespace-pre-wrap break-words">{value}</p>
        ) : (
          <p className="select-none text-sm font-normal tracking-normal text-muted-hud">
            {placeholder}
          </p>
        )}
      </div>
    </section>
  );
}