"use client";

import { useEffect, useRef } from "react";

interface HeaderHeightVarProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Tracks header height and sets CSS variable for Safari fixed positioning
 */
export function HeaderHeightVar({ children, className = "" }: HeaderHeightVarProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const setHeight = () => {
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    };
    
    setHeight();
    window.addEventListener("resize", setHeight);
    
    // Also set on load after a short delay to ensure layout is complete
    const timeout = setTimeout(setHeight, 100);
    
    return () => {
      window.removeEventListener("resize", setHeight);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <header 
      ref={ref as any} 
      className={className}
      // Nuclear test: uncomment this to force visible header in Safari
      // style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 2147483647, background: "red" }}
    >
      {children}
    </header>
  );
}

