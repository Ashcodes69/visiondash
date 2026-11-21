"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { VisionFace } from "@/components/layout/VisionFace";
import { DisplayBox } from "@/components/ui/DisplayBox";
import { Button } from "@/components/ui/Button";
import { useVisionSocket } from "@/hooks/useVisionSocket";

export default function HomePage() {
  const {
    connectionStatus,
    sessionActive,
    isDetected,
    eyesClosed,
    blinkPulse,
    morseBuffer,
    decodedText,
    errorMessage,
    toggleSession,
    backspaceText,
    clearMorse,
    clearAllText,
    setIsDetected,
    simulateBlink,
    simulateCommitLetter,
  } = useVisionSocket();

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!decodedText) return;
    await navigator.clipboard.writeText(decodedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-void text-spectral">
      <Header
        connectionStatus={connectionStatus}
        sessionActive={sessionActive}
        isDetected={isDetected}
        onToggleSession={toggleSession}
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-between gap-8 px-4 py-8 sm:px-6 sm:py-12">
        {/* Subtle Connection Notice if Backend isn't running yet */}
        {errorMessage && (
          <div className="w-full rounded-md border border-border-structural/60 bg-surface/60 px-4 py-2 text-center text-xs text-slate-hud">
            {errorMessage}
          </div>
        )}

        {/* Central White Vision Interface */}
        <section className="flex flex-1 flex-col items-center justify-center py-4">
          <VisionFace
            isDetected={isDetected}
            eyesClosed={eyesClosed}
            blinkPulse={blinkPulse}
          />
        </section>

        {/* Morse & Converted Text Panels */}
        <section className="flex w-full flex-col gap-4">
          {/* Compact Morse Signal Buffer */}
          <DisplayBox
            label="Morse Signal"
            value={morseBuffer}
            placeholder="•  —  waiting for blink sequence"
            monospace
            active={Boolean(morseBuffer)}
            minHeightClass="min-h-[68px]"
            actions={
              morseBuffer && (
                <Button variant="ghost" size="sm" onClick={clearMorse}>
                  Clear Signal
                </Button>
              )
            }
          />

          {/* Primary Converted Text Readout */}
          <DisplayBox
            label="Converted Text"
            value={decodedText}
            placeholder="Decoded message will appear here..."
            active={isDetected}
            minHeightClass="min-h-[140px]"
            actions={
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!decodedText}
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={backspaceText}
                  disabled={!decodedText}
                >
                  Backspace
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={clearAllText}
                  disabled={!decodedText && !morseBuffer}
                >
                  Clear All
                </Button>
              </>
            }
          />
        </section>

        {/* Dev Preview Bar (Remove once FastAPI WebSocket is live) */}
        <footer className="flex flex-wrap items-center justify-center gap-2 border-t border-border-dormant/60 pt-4 text-xs text-muted-hud">
          <span className="mr-1 uppercase tracking-wider">Preview Controls:</span>
          <Button size="sm" variant="ghost" onClick={() => setIsDetected((v) => !v)}>
            {isDetected ? "Lose Face" : "Lock Face"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => simulateBlink(".")}>
            Dot (•)
          </Button>
          <Button size="sm" variant="ghost" onClick={() => simulateBlink("-")}>
            Dash (—)
          </Button>
          <Button size="sm" variant="ghost" onClick={() => simulateCommitLetter("V")}>
            Commit &ldquo;V&rdquo;
          </Button>
        </footer>
      </main>
    </div>
  );
}