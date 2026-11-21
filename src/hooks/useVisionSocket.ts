"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ConnectionStatus, VisionEvent } from "@/types/vision";

const DEFAULT_WS_URL =
  process.env.NEXT_PUBLIC_VISION_WS_URL || "ws://localhost:8000/ws/vision";

export function useVisionSocket(wsUrl: string = DEFAULT_WS_URL) {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [sessionActive, setSessionActive] = useState(false);
  const [isDetected, setIsDetected] = useState(false);
  const [eyesClosed, setEyesClosed] = useState(false);
  const [blinkPulse, setBlinkPulse] = useState(false);
  const [morseBuffer, setMorseBuffer] = useState("");
  const [decodedText, setDecodedText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerBlinkPulse = useCallback(() => {
    setBlinkPulse(true);
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    pulseTimeoutRef.current = setTimeout(() => setBlinkPulse(false), 280);
  }, []);

  const handleEvent = useCallback(
    (event: VisionEvent) => {
      switch (event.type) {
        case "detection":
          setIsDetected(event.faceDetected);
          setEyesClosed(event.eyesClosed);
          break;
        case "blink":
          triggerBlinkPulse();
          setMorseBuffer((prev) => (prev ? `${prev} ${event.signal}` : event.signal));
          break;
        case "morse_update":
          setMorseBuffer(event.morse);
          break;
        case "text_update":
          setDecodedText((prev) =>
            event.append ? `${prev}${event.text}` : event.text
          );
          break;
        case "error":
          setErrorMessage(event.message);
          break;
      }
    },
    [triggerBlinkPulse]
  );

  const startSession = useCallback(() => {
    setErrorMessage(null);
    setSessionActive(true);
    setConnectionStatus("connecting");

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus("connected");
      };

      ws.onmessage = (msg) => {
        try {
          const data: VisionEvent = JSON.parse(msg.data);
          handleEvent(data);
        } catch {
          // Ignore malformed frames
        }
      };

      ws.onerror = () => {
        setConnectionStatus("error");
        setErrorMessage("Backend unreachable — running in local preview mode.");
      };

      ws.onclose = () => {
        setConnectionStatus((prev) => (prev === "error" ? "error" : "disconnected"));
        setIsDetected(false);
        setEyesClosed(false);
      };
    } catch {
      setConnectionStatus("error");
      setErrorMessage("Could not initialize WebSocket connection.");
    }
  }, [wsUrl, handleEvent]);

  const stopSession = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setSessionActive(false);
    setConnectionStatus("disconnected");
    setIsDetected(false);
    setEyesClosed(false);
  }, []);

  const toggleSession = useCallback(() => {
    if (sessionActive) {
      stopSession();
    } else {
      startSession();
    }
  }, [sessionActive, startSession, stopSession]);

  // Text Controls
  const backspaceText = useCallback(() => {
    setDecodedText((prev) => prev.slice(0, -1));
  }, []);

  const clearMorse = useCallback(() => {
    setMorseBuffer("");
  }, []);

  const clearAllText = useCallback(() => {
    setDecodedText("");
    setMorseBuffer("");
  }, []);

  // Local Sandbox Simulator (usable while Python backend is offline)
  const simulateBlink = useCallback(
    (signal: "." | "-") => {
      setIsDetected(true);
      setEyesClosed(true);
      setTimeout(() => {
        setEyesClosed(false);
        handleEvent({ type: "blink", signal });
      }, signal === "." ? 150 : 350);
    },
    [handleEvent]
  );

  const simulateCommitLetter = useCallback((char: string) => {
    setMorseBuffer("");
    setDecodedText((prev) => `${prev}${char}`);
  }, []);

  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.close();
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, []);

  return {
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
    // Mock helpers for UI testing
    setIsDetected,
    setEyesClosed,
    simulateBlink,
    simulateCommitLetter,
  };
}