import { cookies } from "next/headers";
import { siteConfig, type Locale } from "@/lib/config";
import { LOCALE_COOKIE } from "./constants";

// Next.js 16: cookies() is async.
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return (siteConfig.locales as readonly string[]).includes(value ?? "")
    ? (value as Locale)
    : siteConfig.defaultLocale;
}
