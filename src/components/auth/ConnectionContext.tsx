"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ConnectionState = "connecting" | "ready" | "unreachable";

interface ConnectionContextValue {
  state: ConnectionState;
  setState: (s: ConnectionState) => void;
}

const ConnectionContext = createContext<ConnectionContextValue | null>(null);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConnectionState>("connecting");
  return (
    <ConnectionContext.Provider value={{ state, setState }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const ctx = useContext(ConnectionContext);
  if (!ctx)
    throw new Error("useConnection must be used within ConnectionProvider");
  return ctx;
}
