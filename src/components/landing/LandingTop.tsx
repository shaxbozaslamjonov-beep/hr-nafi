"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { siteConfig, type Locale } from "@/lib/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Mode = "seeker" | "employer";

export function LandingTop({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [mode, setMode] = useState<Mode>("seeker");
  const isSeeker = mode === "seeker";
  const hero = isSeeker ? dict.hero.seeker : dict.hero.employer;

  const stats = isSeeker
    ? [
        { value: 1998446, label: dict.stats.seeker.resumes },
        { value: 10988, label: dict.stats.seeker.vacancies },
        { value: 30270, label: dict.stats.seeker.companies },
      ]
    : [
        { value: 45210, label: dict.stats.employer.candidates },
        { value: 8400, label: dict.stats.employer.partners },
        { value: 30270, label: dict.stats.employer.companies },
      ];

  const brandName = siteConfig.name.replace("Jobs", "");

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(99,102,241,0.35),transparent),radial-gradient(ellipse_80%_60%_at_100%_100%,rgba(6,182,212,0.2),transparent)]"
      />

      <header className="container-page flex flex-col gap-4 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-heading text-xl font-bold whitespace-nowrap">
              {brandName}
              <span className="text-gold">Jobs</span>
            </Link>

            <nav className="hidden items-center gap-1 rounded-full bg-card p-1 sm:flex">
              <button
                type="button"
                onClick={() => setMode("seeker")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  isSeeker ? "bg-brand text-white" : "text-ink-2 hover:text-ink"
                }`}
              >
                {dict.tabs.seeker}
              </button>
              <button
                type="button"
                onClick={() => setMode("employer")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  !isSeeker ? "bg-brand text-white" : "text-ink-2 hover:text-ink"
                }`}
              >
                {dict.tabs.employer}
              </button>
            </nav>

            <Link href="/jobs" className="hidden text-sm text-ink-2 hover:text-ink md:inline">
              Vakansiyalar
            </Link>
            <Link href="/courses" className="hidden text-sm text-ink-2 hover:text-ink md:inline">
              Kurslar
            </Link>
            <Link href="/pricing" className="hidden text-sm text-ink-2 hover:text-ink md:inline">
              Tariflar
            </Link>
            <a href="#" className="hidden text-sm text-ink-2 hover:text-ink md:inline">
              {dict.common.help}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-1 text-sm text-ink-2 sm:flex">
              <MapPin size={16} />
              {dict.common.city}
            </div>
            <LocaleSwitcher current={locale} />
            <Link href="/login" className="text-sm font-medium text-ink-2 hover:text-ink">
              {dict.common.login}
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-bg hover:opacity-90 whitespace-nowrap"
            >
              {isSeeker ? dict.header.resumeCta : dict.header.vacancyCta}
            </Link>
          </div>
        </div>

        <nav className="flex w-full items-center gap-1 rounded-full bg-card p-1 sm:hidden">
          <button
            type="button"
            onClick={() => setMode("seeker")}
            className={`flex-1 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              isSeeker ? "bg-brand text-white" : "text-ink-2"
            }`}
          >
            {dict.tabs.seeker}
          </button>
          <button
            type="button"
            onClick={() => setMode("employer")}
            className={`flex-1 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              !isSeeker ? "bg-brand text-white" : "text-ink-2"
            }`}
          >
            {dict.tabs.employer}
          </button>
        </nav>
      </header>

      <section className="container-page grid gap-10 pb-20 pt-10 lg:grid-cols-2 lg:items-center lg:pb-28 lg:pt-16">
        <div>
          <h1 className="text-gradient text-4xl leading-tight sm:text-5xl">{hero.title}</h1>
          <p className="mt-5 max-w-xl text-lg text-ink-2">{hero.subtitle}</p>

          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder={hero.placeholder}
              className="w-full flex-1 rounded-xl border border-line bg-card px-4 py-3 text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none sm:max-w-sm"
            />
            <button
              type="submit"
              className="brand-gradient rounded-xl px-6 py-3 font-semibold text-white shadow-lg shadow-brand/20 transition hover:opacity-90"
            >
              {hero.cta}
            </button>
          </form>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-heading text-3xl font-bold">
                  {s.value.toLocaleString("ru-RU")}
                </dd>
                <div className="text-sm text-ink-2">{s.label}</div>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <p className="mb-3 text-sm text-ink-2">{dict.common.download}</p>
            <div className="flex flex-wrap gap-3">
              {["App Store", "Google Play", "AppGallery"].map((store) => (
                <span key={store} className="card px-4 py-2 text-sm font-medium text-ink-2">
                  {store}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="card relative aspect-4/3 overflow-hidden p-8">
            <div className="brand-gradient absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-accent opacity-20 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center gap-2 text-sm text-ink-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                {isSeeker ? dict.stats.seeker.vacancies : dict.stats.employer.candidates}
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card flex items-center gap-3 p-3">
                    <div className="brand-gradient h-10 w-10 shrink-0 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-2.5 w-2/3 rounded bg-line" />
                      <div className="mt-2 h-2 w-1/3 rounded bg-line/70" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
