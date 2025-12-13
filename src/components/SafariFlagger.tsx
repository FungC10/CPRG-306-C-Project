"use client";

import { useEffect } from "react";
import { isSafari } from "@/lib/isSafari";

/**
 * Adds 'is-safari' class to <html> element for Safari-specific CSS fixes
 */
export default function SafariFlagger() {
  useEffect(() => {
    if (isSafari()) {
      document.documentElement.classList.add("is-safari");
    }
  }, []);
  return null;
}

