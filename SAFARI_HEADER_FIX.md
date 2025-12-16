# Safari Sticky Header Disappearing – Root Cause & First-Try Fix

## The Real Root Cause (Important)

Safari has compositing / painting bugs when ANY of these are combined:
- `position: sticky`
- `backdrop-filter` or `filter: blur()`
- ancestors with `transform`, `filter`, `overflow-hidden`, or `transition-all`

When this happens, the header is in the DOM but not painted (appears invisible), even with very high z-index.

This does NOT reproduce in Chrome, and often only appears after production build / deploy.

## The Correct Mental Model

In Safari, sticky must stay "clean".
Blur / filters must never live on the sticky element or its ancestors.

## ✅ The FIRST Fix to Apply (Works 90% of the Time)

### 1️⃣ Make the sticky element clean

No blur, no filter, no transform on the sticky element itself

```tsx
<header className="sticky top-0 z-[9999] isolate">
  <div className="bg-slate-950/90 backdrop-blur md:backdrop-blur">
    ...
  </div>
</header>
```

**Key points:**
- `sticky` on outer wrapper
- `backdrop-blur` on inner div
- `isolate` forces its own stacking context (Safari critical)

## ✅ If There Are Background Blur Blobs (VERY Common Cause)

### 2️⃣ Blur backgrounds must be:
- behind everything
- hidden in Safari

```tsx
<div className="bg-blobs fixed inset-0 -z-10">
  <div className="blur-3xl ..."></div>
</div>
```

```css
html.is-safari .bg-blobs {
  display: none !important;
}
```

**`filter: blur()` on background layers breaks Safari compositing**

## ✅ Guaranteed Fallback (Nuclear but Clean)

### 3️⃣ Safari uses fixed, others use sticky

```css
.site-header {
  position: sticky;
  top: 0;
}

html.is-safari .site-header {
  position: fixed;
}
```

```tsx
<main className="pt-14 md:pt-0">{children}</main>
```

This never fails, even on iOS Safari.

## ❌ Things to AVOID Near Headers in Safari

Check/remove these immediately:
- ❌ `filter: blur()` near root
- ❌ `backdrop-filter` on sticky element
- ❌ `overflow-hidden` on body / root wrappers
- ❌ `transition-all` on layout containers
- ❌ `transform` on ancestors (including Framer Motion wrappers)

## One-Sentence Instruction

**"Safari has a compositing bug with sticky + blur. Keep sticky headers clean, move blur to inner elements or background layers, hide blur in Safari, and fall back to position: fixed for Safari if needed."**

## Quick Pattern Recognition

If you hit a Safari bug, ask: **"Is this another Safari compositing bug?"**

Common symptoms:
- Works in Chrome, broken in Safari
- Works in dev, broken in production
- Element exists in DOM but is invisible
- High z-index doesn't help
- Related to sticky/fixed positioning + filters/blur

