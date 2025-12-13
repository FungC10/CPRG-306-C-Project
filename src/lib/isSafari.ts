/**
 * Detect if the current browser is Safari
 * Safari has known issues with position: sticky + backdrop-filter
 */
export function isSafari(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const isAppleWebKit = /AppleWebKit/.test(ua);
  const isChromeOrCriOS = /Chrome|CriOS|Edg/.test(ua);
  return isAppleWebKit && !isChromeOrCriOS;
}

