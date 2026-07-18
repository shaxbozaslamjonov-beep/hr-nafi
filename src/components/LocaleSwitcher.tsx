"use client";

import { useRouter } from "next/navigation";
import { LOCALE_COOKIE } from "@/lib/i18n/constants";
import type { Locale } from "@/lib/config";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const router = useRouter();

  function setLocale(locale: Locale) {
    if (locale === current) return;
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        type="button"
        onClick={() => setLocale("uz")}
        className={current === "uz" ? "text-ink" : "text-ink-2 hover:text-ink"}
      >
        UZ
      </button>
      <span className="text-ink-3">/</span>
      <button
        type="button"
        onClick={() => setLocale("ru")}
        className={current === "ru" ? "text-ink" : "text-ink-2 hover:text-ink"}
      >
        RU
      </button>
    </div>
  );
}
