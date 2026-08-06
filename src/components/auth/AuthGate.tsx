"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import SplashScreen from "./SplashScreen";
import TurnstileWidget from "./TurnstileWidget";
import { useConnection } from "./ConnectionContext";

type AuthState = "checking" | "needs_turnstile" | "authenticated" | "error";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;
const SPLASH_DELAY_MS = 150;
const CACHE_KEY = "zeyrix_was_authenticated";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { setState } = useConnection();

  const [authState, setAuthState] = useState<AuthState>("checking");
  const [showSplash, setShowSplash] = useState(false);
  const hasStartedRef = useRef(false);
  const retryCountRef = useRef(0);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (sessionStorage.getItem(CACHE_KEY) === "true") {
      setAuthState("authenticated");
    }

    checkStatus();
  }, []);

  useEffect(() => {
    if (authState !== "checking") {
      setShowSplash(false);
      return;
    }
    const timer = setTimeout(() => setShowSplash(true), SPLASH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [authState]);

  async function checkStatus() {
    let res: Response;
    try {
      res = await fetch("/api/auth/status", { credentials: "include" });
    } catch {
      setState("unreachable");
      handleFailure();
      return;
    }

    if (!res.ok) {
      setState("unreachable");
      handleFailure();
      return;
    }

    setState("ready");

    let data: { authenticated?: boolean };
    try {
      data = await res.json();
    } catch {
      handleFailure();
      return;
    }

    retryCountRef.current = 0;

    if (data.authenticated) {
      sessionStorage.setItem(CACHE_KEY, "true");
      setAuthState("authenticated");
    } else {
      sessionStorage.removeItem(CACHE_KEY);
      setAuthState("needs_turnstile");
    }
  }

  function handleFailure() {
    if (retryCountRef.current < MAX_RETRIES) {
      const attempt = retryCountRef.current;
      retryCountRef.current += 1;
      setTimeout(checkStatus, RETRY_DELAY_MS * 2 ** attempt);
      return;
    }
    if (authState !== "authenticated") {
      setAuthState("error");
    }
  }

  function handleManualRetry() {
    retryCountRef.current = 0;
    setAuthState("checking");
    checkStatus();
  }

  if (authState === "checking") {
    return showSplash ? <SplashScreen /> : <div className="fixed inset-0 bg-background" />;
  }

  if (authState === "error") {
    return (
      <SplashScreen>
        <p className="text-body-sm text-foreground-muted">
          Не удалось подключиться к серверу.
        </p>
        <button onClick={handleManualRetry} className="text-btn text-primary underline hover:cursor-pointer">
          Повторить
        </button>
      </SplashScreen>
    );
  }

  if (authState === "needs_turnstile") {
    return (
      <SplashScreen>
        <TurnstileWidget onSuccess={() => {
          sessionStorage.setItem(CACHE_KEY, "true");
          setAuthState("authenticated");
        }} />
      </SplashScreen>
    );
  }

  return <>{children}</>;
}