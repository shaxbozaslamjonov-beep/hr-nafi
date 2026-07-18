export const siteConfig = {
  name: "EducaJobs",
  tagline: "O'qish, ish va biznes uchun yagona ekotizim",
  defaultCity: "Samarqand",
  locales: ["uz", "ru"] as const,
  defaultLocale: "uz" as const,
};

export type Locale = (typeof siteConfig.locales)[number];
