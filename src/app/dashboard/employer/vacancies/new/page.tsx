import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEmployerCompany } from "@/lib/company";
import { VacancyForm } from "@/components/hh/VacancyForm";

export default async function NewVacancyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const company = await getEmployerCompany(supabase, user.id);

  if (!company) {
    redirect("/dashboard/employer");
  }

  return (
    <main className="px-4 py-16">
      <VacancyForm companyId={company.id} />
    </main>
  );
}
