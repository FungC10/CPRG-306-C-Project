"use client";

import { useEffect } from "react";
import { isSafari } from "@/lib/isSafari";

/**
 * Adds 'is-safari' class to <html> element for Safari-specific CSS fixes
 * This is a backup in case the inline script in layout.tsx doesn't run
 */
export default function SafariFlagger() {
  useEffect(() => {
    if (isSafari()) {
      document.documentElement.classList.add("is-safari");
      // Debug helper - can be removed in production
      if (process.env.NODE_ENV === 'development') {
        console.log('[SafariFlagger] Safari detected, added is-safari class');
        console.log('[SafariFlagger] Header should use position: fixed');
      }
    }
  }, []);
  return null;
}

