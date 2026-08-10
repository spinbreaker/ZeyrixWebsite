"use client";

import { ReactNode, useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarContext } from "./SidebarContext";

export function SidebarDesktop({ children }: { children: ReactNode }) {
  const sidebarCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("sidebar="))
    ?.split("=")[1];
  const [expanded, setExpanded] = useState(
    sidebarCookie === "expanded" ? true : false,
  );

  const toggle = () => {
    setExpanded((prev) => !prev);
    document.cookie = expanded
      ? "sidebar=no; path=/"
      : "sidebar=expanded; path=/";
  };

  return (
    <SidebarContext.Provider value={{ expanded, toggle }}>
      <aside
        className={`
                    h-full
                    bg-background
                    border-r border-border
                    flex flex-col
                    transition-[width] duration-150 ease-out
                    overflow-hidden
                    ${expanded ? "w-72" : "w-16"}
                `}
      >
        <SidebarHeader />

        <div className="flex-1 flex flex-col min-h-0 justify-between">
          <div
            className={`
                            flex-1 min-h-0 flex flex-col
                            transition-opacity duration-150
                            ${expanded ? "opacity-100" : "opacity-0 pointer-events-none"}
                        `}
          >
            {children}
          </div>

          <SidebarFooter />
        </div>
      </aside>
    </SidebarContext.Provider>
  );
}
