"use client";

import { useEffect, useRef } from "react";

// Debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 400) {
  let t: any;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// Try to set the Google Translate combo (hidden select) to the saved language
function applyGoogleTranslateSelection(lang: string) {
  try {
    const select: HTMLSelectElement | null = document.querySelector(
      "select.goog-te-combo"
    );
    if (select && select.value !== lang) {
      select.value = lang;
      const evt = new Event("change", { bubbles: true });
      select.dispatchEvent(evt);
      return true;
    }
  } catch {}
  return false;
}

export default function GoogleTranslateProvider() {
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("site-lang") || "ru";
    // Sync <html lang>
    try {
      document.documentElement.setAttribute("lang", saved);
    } catch {}

    const reapply = debounce(() => {
      if (saved && saved !== "ru") {
        applyGoogleTranslateSelection(saved);
      }
    }, 300);

    // Try once on ready (when the select appears)
    const readyInterval = setInterval(() => {
      const ok = applyGoogleTranslateSelection(saved);
      if (ok) {
        clearInterval(readyInterval);
      }
    }, 400);

    // Observe DOM changes to keep new content translated (SPA updates)
    observerRef.current = new MutationObserver(() => {
      reapply();
    });
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false,
    });

    return () => {
      clearInterval(readyInterval);
      observerRef.current?.disconnect();
    };
  }, []);

  return null;
}
