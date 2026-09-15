"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type ConnectionState = "connecting" | "ready" | "unreachable";
type Access = "loading" | "granted" | "disabled";

interface ConnectionContextValue {
  state: ConnectionState;
  access: Access;
  setState: (s: ConnectionState) => void;
  setAccess: (s: Access) => void;
}

const ConnectionContext = createContext<ConnectionContextValue | null>(null);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConnectionState>("connecting");
  const [access, setAccess] = useState<Access>("loading");

  return (
    <ConnectionContext.Provider value={{ state, access, setState, setAccess }}>
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
