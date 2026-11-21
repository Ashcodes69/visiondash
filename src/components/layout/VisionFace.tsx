"use client";

import React from "react";

export interface VisionFaceProps {
  /** True when both face and eye landmarks are confirmed by the backend */
  isDetected: boolean;
  /** True when the user's eyes are currently closed */
  eyesClosed: boolean;
  /** Triggered briefly when a full blink is registered */
  blinkPulse?: boolean;
  /** Optional className for container positioning or scaling */
  className?: string;
}

export function VisionFace({
  isDetected,
  eyesClosed,
  blinkPulse = false,
  className = "",
}: VisionFaceProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      role="img"
      aria-label={
        !isDetected
          ? "Vision interface dormant: waiting for face detection"
          : eyesClosed
            ? "Vision interface active: eyes closed"
            : "Vision interface active: eyes open"
      }
    >
      {/* Subtle ambient aura behind the face when tracking is locked */}
      <div
        className={`pointer-events-none absolute h-48 w-64 rounded-full bg-cyan-core/10 blur-3xl transition-opacity duration-500 ${
          isDetected ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 1. Forehead Diamond (Detection Status) */}
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
        {/* Inactive Diamond */}
        <img
          src="/diamond/inactive_diamond.svg"
          alt=""
          draggable={false}
          className={`h-16 w-16 object-contain transition-opacity duration-300 ${
            isDetected ? "opacity-0" : "opacity-90"
          }`}
        />

        {/* Active Diamond (oversized box so inner diamond matches 64px inactive size) */}
        <img
          src="/diamond/active_diamond.svg"
          alt=""
          draggable={false}
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[540px] w-[540px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain transition-all duration-300 ${
            isDetected ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        />
      </div>

      {/* 2. Symmetrical Pair of Eyes */}
      <div
        className={`flex items-center justify-center gap-12 sm:gap-16 transition-transform duration-200 ${
          blinkPulse ? "scale-[1.03]" : "scale-100"
        }`}
      >
        <EyeUnit
          isDetected={isDetected}
          eyesClosed={eyesClosed}
          blinkPulse={blinkPulse}
        />
        <EyeUnit
          isDetected={isDetected}
          eyesClosed={eyesClosed}
          blinkPulse={blinkPulse}
          mirrored
        />
      </div>
    </div>
  );
}

interface EyeUnitProps {
  isDetected: boolean;
  eyesClosed: boolean;
  blinkPulse: boolean;
  mirrored?: boolean;
}

function EyeUnit({
  isDetected,
  eyesClosed,
  blinkPulse,
  mirrored = false,
}: EyeUnitProps) {
  const showOpenInactive = !isDetected && !eyesClosed;
  const showClosedInactive = !isDetected && eyesClosed;
  const showOpenActive = isDetected && !eyesClosed;
  const showClosedActive = isDetected && eyesClosed;

  return (
    <div
      className={`relative h-12 w-32 sm:h-14 sm:w-36 transition-all duration-200 ${
        mirrored ? "-scale-x-100" : ""
      } ${
        blinkPulse
          ? "drop-shadow-[0_0_16px_rgba(121,221,244,0.8)]"
          : isDetected
            ? "drop-shadow-[0_0_8px_rgba(121,221,244,0.25)]"
            : ""
      }`}
    >
      {/* Open Inactive */}
      <img
        src="/eyes/open_inactive.svg"
        alt=""
        draggable={false}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-150 ${
          showOpenInactive ? "opacity-90" : "opacity-0"
        }`}
      />

      {/* Closed Inactive */}
      <img
        src="/eyes/closed_inactive.svg"
        alt=""
        draggable={false}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-100 ${
          showClosedInactive ? "opacity-90" : "opacity-0"
        }`}
      />

      {/* Open Active */}
      <img
        src="/eyes/open_active.svg"
        alt=""
        draggable={false}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-150 ${
          showOpenActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Closed Active */}
      <img
        src="/eyes/closed_active.svg"
        alt=""
        draggable={false}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-100 ${
          showClosedActive ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
