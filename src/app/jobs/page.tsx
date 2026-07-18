import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SaveVacancyButton } from "@/components/hh/SaveVacancyButton";

const employmentLabels: Record<string, string> = {
  full_time: "To'liq stavka",
  part_time: "Yarim stavka",
  remote: "Masofaviy",
  internship: "Amaliyot",
  project: "Loyihaviy",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string }>;
}) {
  const { q, city } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("vacancies")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }
  if (city) {
    query = query.eq("city", city);
  }

  const { data: vacancies } = await query;

  const companyIds = [...new Set((vacancies ?? []).map((v) => v.company_id))];
  const { data: companies } = companyIds.length
    ? await supabase.from("companies").select("*").in("id", companyIds)
    : { data: [] };
  const companyMap = new Map((companies ?? []).map((c) => [c.id, c]));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let savedIds = new Set<string>();
  let isStudent = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isStudent = profile?.role === "student";

    if (isStudent) {
      const { data: saved } = await supabase
        .from("saved_vacancies")
        .select("vacancy_id")
        .eq("user_id", user.id);
      savedIds = new Set((saved ?? []).map((s) => s.vacancy_id));
    }
  }

  return (
    <main className="container-page py-10">
      <h1 className="text-2xl font-bold">Vakansiyalar</h1>

      <form className="mt-4 flex flex-wrap gap-3">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Lavozim bo'yicha qidirish..."
          className="w-full max-w-xs rounded-lg border border-line bg-bg-2 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <input
          type="text"
          name="city"
          defaultValue={city}
          placeholder="Shahar"
          className="w-full max-w-[10rem] rounded-lg border border-line bg-bg-2 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-card"
        >
          Qidirish
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3">
        {(vacancies ?? []).map((v) => {
          const company = companyMap.get(v.company_id);
          return (
            <div key={v.id} className="card p-5 hover:border-brand">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <Link href={`/jobs/${v.id}`} className="flex-1">
                  <h2 className="text-lg font-semibold">{v.title}</h2>
                  <p className="mt-1 text-sm text-ink-2">
                    {company?.name ?? "Kompaniya"} · {v.city}
                  </p>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap rounded-full bg-card-2 px-3 py-1 text-xs text-ink-2">
                    {employmentLabels[v.employment_type]}
                  </span>
                  {isStudent && (
                    <SaveVacancyButton vacancyId={v.id} initiallySaved={savedIds.has(v.id)} />
                  )}
                </div>
              </div>

              {(v.salary_min || v.salary_max) && (
                <p className="mt-3 text-sm font-medium text-brand">
                  {v.salary_min?.toLocaleString("ru-RU")} —{" "}
                  {v.salary_max?.toLocaleString("ru-RU")} so&apos;m
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {v.skills.slice(0, 5).map((s) => (
                  <span key={s} className="rounded-full bg-card-2 px-2 py-0.5 text-xs text-ink-2">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        {(!vacancies || vacancies.length === 0) && (
          <p className="py-16 text-center text-ink-3">Hozircha vakansiyalar topilmadi.</p>
        )}
      </div>
    </main>
  );
}
