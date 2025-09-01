"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

// Helper to set Google Translate cookie so translation persists across tabs
function setCookie(name: string, value: string, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  const path = "; path=/";
  const domain = window.location.hostname;
  // Set for current domain and root domain (if applicable)
  document.cookie = `${name}=${value}${expires}${path}`;
  if (domain.split(".").length > 2) {
    const root = domain.substring(domain.indexOf("."));
    document.cookie = `${name}=${value}${expires}${path}; domain=${root}`;
  }
}

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : undefined;
}

const includedLanguages = "ru,uk,en"; // RU / Ukrainian / EN
const defaultLang = "ru";

export default function LanguageSwitcher() {
  const [current, setCurrent] = useState<string>(defaultLang);
  const [ready, setReady] = useState(false);

  // Load Google Translate script once
  useEffect(() => {
    // If already loaded
    if ((window as any).google && (window as any).google.translate) {
      setReady(true);
      return;
    }

    (window as any).googleTranslateElementInit = function () {
      try {
        // eslint-disable-next-line no-new
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: defaultLang,
            includedLanguages,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      } catch (e) {
        // ignore
      }
      setReady(true);
    };

    const id = "google-translate-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  // Initialize from cookie/localStorage
  useEffect(() => {
    const saved = localStorage.getItem("site-lang");
    const cookie = getCookie("googtrans");
    let lang = saved || current;
    if (cookie && cookie.includes("/")) {
      const parts = cookie.split("/");
      lang = parts[parts.length - 1] || lang;
    }
    if (saved && saved !== current) setCurrent(saved);
    // Ensure cookie is aligned with saved
    if (saved && (!cookie || !cookie.endsWith("/" + saved))) {
      setTranslateLang(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTranslateLang = useCallback((lang: string) => {
    // Google expects cookie in format "+/source/target" — using /auto/ to detect automatically
    const value = `/auto/${lang}`;
    setCookie("googtrans", value);
    setCookie("googtrans", value); // set twice to be safe for both domains
    localStorage.setItem("site-lang", lang);
  }, []);

  const handleChange = (lang: string) => {
    if (lang === current) return;
    setCurrent(lang);
    setTranslateLang(lang);
    // Reload to force re-translation across all islands
    window.location.reload();
  };

  return (
    <div className="flex items-center">
      {/* Hidden container that Google uses under the hood */}
      <div id="google_translate_element" className="hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Change language" disabled={!ready}>
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[8rem]">
          <DropdownMenuRadioGroup value={current} onValueChange={handleChange}>
            <DropdownMenuRadioItem value="ru">Русский (RU)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="uk">Українська (UA)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="en">English (EN)</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
