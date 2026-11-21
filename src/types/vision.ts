export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export interface VisionState {
  connectionStatus: ConnectionStatus;
  sessionActive: boolean;
  isDetected: boolean;
  eyesClosed: boolean;
  blinkPulse: boolean;
  morseBuffer: string;
  decodedText: string;
  errorMessage: string | null;
}

export type VisionEvent =
  | { type: "detection"; faceDetected: boolean; eyesClosed: boolean }
  | { type: "blink"; signal: "." | "-" }
  | { type: "morse_update"; morse: string }
  | { type: "text_update"; text: string; append?: boolean }
  | { type: "error"; message: string };