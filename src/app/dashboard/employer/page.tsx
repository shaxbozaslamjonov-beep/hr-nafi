import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEmployerCompany } from "@/lib/company";
import { CreateCompanyForm } from "@/components/hh/CreateCompanyForm";

export default async function EmployerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const company = await getEmployerCompany(supabase, user.id);

  if (!company) {
    return (
      <main className="px-4 py-16">
        <CreateCompanyForm />
      </main>
    );
  }

  const [{ count: vacanciesCount }, { count: publishedCount }] = await Promise.all([
    supabase
      .from("vacancies")
      .select("*", { count: "exact", head: true })
      .eq("company_id", company.id),
    supabase
      .from("vacancies")
      .select("*", { count: "exact", head: true })
      .eq("company_id", company.id)
      .eq("status", "published"),
  ]);

  return (
    <main className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="mt-1 text-sm text-ink-2">
            {company.industry ?? "Soha ko'rsatilmagan"} · {company.city}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/employer/team"
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-card"
          >
            Jamoa
          </Link>
          <Link
            href="/dashboard/employer/vacancies"
            className="brand-gradient rounded-lg px-4 py-2 text-sm font-semibold text-white"
          >
            Vakansiyalarim
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="font-heading text-3xl font-bold">{vacanciesCount ?? 0}</div>
          <div className="mt-1 text-sm text-ink-2">Jami vakansiya</div>
        </div>
        <div className="card p-5">
          <div className="font-heading text-3xl font-bold">{publishedCount ?? 0}</div>
          <div className="mt-1 text-sm text-ink-2">Faol vakansiya</div>
        </div>
        <div className="card p-5">
          <div className="font-heading text-3xl font-bold">
            {company.verified ? "Ha" : "Yo'q"}
          </div>
          <div className="mt-1 text-sm text-ink-2">Tasdiqlangan</div>
        </div>
      </div>
    </main>
  );
}
