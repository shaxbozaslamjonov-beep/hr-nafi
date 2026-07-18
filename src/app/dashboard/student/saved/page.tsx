import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SaveVacancyButton } from "@/components/hh/SaveVacancyButton";

export default async function SavedVacanciesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: saved } = await supabase
    .from("saved_vacancies")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const vacancyIds = [...new Set((saved ?? []).map((s) => s.vacancy_id))];
  const { data: vacancies } = vacancyIds.length
    ? await supabase.from("vacancies").select("*").in("id", vacancyIds)
    : { data: [] };
  const vacancyMap = new Map((vacancies ?? []).map((v) => [v.id, v]));

  return (
    <main className="container-page py-10">
      <h1 className="text-2xl font-bold">Saqlangan ishlar</h1>

      <div className="mt-6 flex flex-col gap-3">
        {(saved ?? []).map((s) => {
          const vacancy = vacancyMap.get(s.vacancy_id);
          if (!vacancy) return null;
          return (
            <div key={s.id} className="card flex items-center justify-between gap-4 p-4">
              <Link href={`/jobs/${vacancy.id}`} className="flex-1">
                <h2 className="font-medium hover:text-brand">{vacancy.title}</h2>
                <p className="mt-1 text-sm text-ink-2">{vacancy.city}</p>
              </Link>
              <SaveVacancyButton vacancyId={vacancy.id} initiallySaved />
            </div>
          );
        })}
        {(!saved || saved.length === 0) && (
          <p className="py-10 text-center text-ink-3">Hali hech qanday vakansiya saqlamagansiz.</p>
        )}
      </div>
    </main>
  );
}
