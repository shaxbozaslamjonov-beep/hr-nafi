import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LandingTop } from "@/components/landing/LandingTop";
import { ModulesSection } from "@/components/landing/ModulesSection";
import { SiteFooter } from "@/components/landing/SiteFooter";

export default async function Home() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <LandingTop dict={dict} locale={locale} />
      <ModulesSection dict={dict} />
      <SiteFooter dict={dict} />
    </>
  );
}
