"use client";

import MainLogo from "@/public/icons/logoMain.svg";
import MenuIcon from "@/src/icons/burger.svg";
import { useState } from "react";
import { MenuOverlay } from "./menu";

export function HeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);

  const openMenu = () => {
      setIsMenuMounted(true);
      setIsMenuOpen(false);

      window.requestAnimationFrame(() => {
      setIsMenuOpen(true);
      });
  };

  const closeMenu = () => setIsMenuOpen(false);
  const handleMenuExited = () => setIsMenuMounted(false);

  return (
    <div className="fixed inset-0 bg-background h-14 flex flex-row justify-between items-center border-b border-border px-6 z-1">
      <div className="flex flex-row gap-2">
          <MainLogo className="size-7 text-primary" />
          <h2 className="font-display-en font-light text-h2">zeyrix</h2>
      </div>

      <MenuIcon 
        className="size-4.5"
        onClick={openMenu}
      />

      {isMenuOpen && (
        <MenuOverlay
          open={isMenuOpen}
          onClose={closeMenu}
          onExited={handleMenuExited}
        />
      )}
    </div>
)
}