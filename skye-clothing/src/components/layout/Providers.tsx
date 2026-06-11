"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { useUIStore } from "@/store/ui";

function DarkModeSync() {
  const setDarkMode = useUIStore((s) => s.setDarkMode);

  useEffect(() => {
    const stored = localStorage.getItem("skye-dark-mode");
    const shouldBeDark =
      stored === "true" ||
      (stored === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(shouldBeDark);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <DarkModeSync />
      {children}
    </SessionProvider>
  );
}
