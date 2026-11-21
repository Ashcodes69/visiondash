"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { StatusBadge, StatusTone } from "@/components/ui/StatusBadge";
import { ConnectionStatus } from "@/types/vision";

export interface HeaderProps {
  connectionStatus: ConnectionStatus;
  sessionActive: boolean;
  isDetected: boolean;
  onToggleSession: () => void;
}

export function Header({
  connectionStatus,
  sessionActive,
  isDetected,
  onToggleSession,
}: HeaderProps) {
  const connectionTone: StatusTone =
    connectionStatus === "connected"
      ? "active"
      : connectionStatus === "error"
      ? "danger"
      : "idle";

  const connectionLabel =
    connectionStatus === "connected"
      ? "Backend Online"
      : connectionStatus === "connecting"
      ? "Connecting..."
      : connectionStatus === "error"
      ? "Connection Error"
      : "Standby";

  return (
    <header className="w-full border-b border-border-dormant bg-chassis/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rotate-45 bg-cyan-core shadow-[0_0_10px_rgba(121,221,244,0.8)]" />
          <h1 className="text-base font-semibold tracking-[0.2em] text-spectral uppercase sm:text-lg">
            Vision<span className="text-cyan-core">Dash</span>
          </h1>
        </div>

        {/* Status Pills & Session Action */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <StatusBadge
            label={connectionLabel}
            tone={connectionTone}
            pulse={connectionStatus === "connecting"}
            className="hidden sm:inline-flex"
          />

          <StatusBadge
            label={isDetected ? "Target Locked" : "No Face"}
            tone={isDetected ? "active" : "idle"}
            className="hidden md:inline-flex"
          />

          <Button
            variant={sessionActive ? "danger" : "primary"}
            size="sm"
            onClick={onToggleSession}
          >
            {sessionActive ? "Stop Session" : "Start Session"}
          </Button>
        </div>
      </div>
    </header>
  );
}
