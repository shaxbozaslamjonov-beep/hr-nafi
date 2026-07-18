import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplyForm } from "@/components/hh/ApplyForm";
import { SaveVacancyButton } from "@/components/hh/SaveVacancyButton";
import { computeMatchScore } from "@/lib/match";
import type { Resume } from "@/types/database";

const employmentLabels: Record<string, string> = {
  full_time: "To'liq stavka",
  part_time: "Yarim stavka",
  remote: "Masofaviy",
  internship: "Amaliyot",
  project: "Loyihaviy",
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: vacancy } = await supabase
    .from("vacancies")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (!vacancy) {
    notFound();
  }

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", vacancy.company_id)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileRole: string | null = null;
  let resumes: Resume[] = [];
  let isSaved = false;
  let matchScore: number | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    profileRole = profile?.role ?? null;

    if (profileRole === "student") {
      const { data } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "published");
      resumes = data ?? [];

      if (resumes.length > 0) {
        const bestResumeSkills = resumes.reduce<string[]>((best, r) => {
          const score = computeMatchScore(r.skills, vacancy.skills);
          const bestScore = computeMatchScore(best, vacancy.skills);
          return score > bestScore ? r.skills : best;
        }, resumes[0].skills);
        matchScore = computeMatchScore(bestResumeSkills, vacancy.skills);
      }

      const { data: saved } = await supabase
        .from("saved_vacancies")
        .select("id")
        .eq("user_id", user.id)
        .eq("vacancy_id", id)
        .maybeSingle();
      isSaved = Boolean(saved);
    }
  }

  return (
    <main className="container-page grid gap-8 py-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-bold">{vacancy.title}</h1>
          {profileRole === "student" && (
            <SaveVacancyButton vacancyId={vacancy.id} initiallySaved={isSaved} />
          )}
        </div>
        <p className="mt-2 text-ink-2">
          {company?.name ?? "Kompaniya"} · {vacancy.city} ·{" "}
          {employmentLabels[vacancy.employment_type]}
        </p>

        {matchScore !== null && (
          <p className="mt-3 inline-block rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
            Sizga moslik: {matchScore}%
          </p>
        )}

        {(vacancy.salary_min || vacancy.salary_max) && (
          <p className="mt-3 text-lg font-semibold text-brand">
            {vacancy.salary_min?.toLocaleString("ru-RU")} —{" "}
            {vacancy.salary_max?.toLocaleString("ru-RU")} so&apos;m
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {vacancy.skills.map((s) => (
            <span key={s} className="rounded-full bg-card-2 px-2.5 py-1 text-xs text-ink-2">
              {s}
            </span>
          ))}
        </div>

        <div className="card mt-6 whitespace-pre-line p-6 text-sm text-ink-2">
          {vacancy.description}
        </div>
      </div>

      <div>
        {!user && (
          <div className="card p-6 text-center">
            <p className="text-sm text-ink-2">Ariza berish uchun tizimga kiring.</p>
            <Link
              href="/login"
              className="brand-gradient mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white"
            >
              Kirish
            </Link>
          </div>
        )}

        {user && profileRole === "student" && (
          <ApplyForm vacancyId={vacancy.id} resumes={resumes ?? []} />
        )}

        {user && profileRole && profileRole !== "student" && (
          <div className="card p-6 text-center text-sm text-ink-2">
            Faqat talaba/ish izlovchi hisobi orqali ariza berish mumkin.
          </div>
        )}
      </div>
    </main>
  );
}
