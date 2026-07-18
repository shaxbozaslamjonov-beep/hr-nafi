import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { count: usersCount },
    { count: companiesCount },
    { count: blockedCount },
    { count: vacanciesCount },
    { count: publishedVacanciesCount },
    { count: applicationsCount },
    { count: coursesCount },
    { count: certificatesCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("companies").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "blocked"),
    supabase.from("vacancies").select("*", { count: "exact", head: true }),
    supabase.from("vacancies").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("applications").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
  ]);

  const globalStats = [
    { label: "Foydalanuvchilar", value: usersCount ?? 0 },
    { label: "Kompaniyalar", value: companiesCount ?? 0 },
    { label: "Bloklangan", value: blockedCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-tight text-[#181c1e]">
        Global tizim holati
      </h1>
      <p className="mt-1 text-sm text-[#43474d]">Platformaning umumiy ko&apos;rsatkichlari</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {globalStats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-[#e0e3e6] bg-white p-5 shadow-[0_4px_20px_rgba(10,37,64,0.06)]"
          >
            <div className="text-3xl font-bold tracking-tight text-[#181c1e]">{s.value}</div>
            <div className="mt-1 text-sm text-[#43474d]">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-[#181c1e]">Modullar bo&apos;yicha</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[#e0e3e6] border-l-4 border-l-[#00d084] bg-white p-5 shadow-[0_4px_20px_rgba(10,37,64,0.06)]">
          <h3 className="font-semibold text-[#181c1e]">Ish / HH-yadro</h3>
          <div className="mt-3 flex gap-8">
            <div>
              <div className="text-2xl font-bold text-[#181c1e]">{vacanciesCount ?? 0}</div>
              <div className="text-xs text-[#43474d]">Jami vakansiya</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#181c1e]">
                {publishedVacanciesCount ?? 0}
              </div>
              <div className="text-xs text-[#43474d]">Faol vakansiya</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#181c1e]">{applicationsCount ?? 0}</div>
              <div className="text-xs text-[#43474d]">Arizalar</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#e0e3e6] border-l-4 border-l-[#00d084] bg-white p-5 shadow-[0_4px_20px_rgba(10,37,64,0.06)]">
          <h3 className="font-semibold text-[#181c1e]">O&apos;quv moduli</h3>
          <div className="mt-3 flex gap-8">
            <div>
              <div className="text-2xl font-bold text-[#181c1e]">{coursesCount ?? 0}</div>
              <div className="text-xs text-[#43474d]">Kurslar</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#181c1e]">{certificatesCount ?? 0}</div>
              <div className="text-xs text-[#43474d]">Berilgan sertifikatlar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
