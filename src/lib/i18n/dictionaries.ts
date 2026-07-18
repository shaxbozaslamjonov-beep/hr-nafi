import type { Locale } from "@/lib/config";
import uz from "./dictionaries/uz";
import ru from "./dictionaries/ru";

const dictionaries = { uz, ru };

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.uz;
}

export type { Dictionary } from "./types";
