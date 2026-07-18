import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEmployerCompany } from "@/lib/company";
import { VacancyRow } from "@/components/hh/VacancyRow";

export default async function EmployerVacanciesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const company = await getEmployerCompany(supabase, user.id);

  if (!company) {
    redirect("/dashboard/employer");
  }

  const { data: vacancies } = await supabase
    .from("vacancies")
    .select("*")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false });

  return (
    <main className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Vakansiyalarim</h1>
        <Link
          href="/dashboard/employer/vacancies/new"
          className="brand-gradient rounded-lg px-4 py-2 text-sm font-semibold text-white"
        >
          + Yangi vakansiya
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-ink-2">
            <tr>
              <th className="px-4 py-3 font-medium">Sarlavha</th>
              <th className="px-4 py-3 font-medium">Shahar</th>
              <th className="px-4 py-3 font-medium">Holat</th>
              <th className="px-4 py-3 font-medium"></th>
              <th className="px-4 py-3 font-medium">O&apos;zgartirish</th>
            </tr>
          </thead>
          <tbody>
            {(vacancies ?? []).map((v) => (
              <VacancyRow key={v.id} vacancy={v} />
            ))}
            {(!vacancies || vacancies.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-3">
                  Hali vakansiya joylamagansiz.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
