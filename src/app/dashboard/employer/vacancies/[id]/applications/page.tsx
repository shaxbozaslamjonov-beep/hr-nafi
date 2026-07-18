import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplicationKanban } from "@/components/hh/ApplicationKanban";

export default async function VacancyApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: vacancy } = await supabase.from("vacancies").select("*").eq("id", id).single();
  if (!vacancy) {
    redirect("/dashboard/employer/vacancies");
  }

  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .eq("vacancy_id", id)
    .order("created_at", { ascending: false });

  const resumeIds = [...new Set((applications ?? []).map((a) => a.resume_id))];
  const userIds = [...new Set((applications ?? []).map((a) => a.user_id))];

  const [{ data: resumes }, { data: applicants }] = await Promise.all([
    resumeIds.length
      ? supabase.from("resumes").select("*").in("id", resumeIds)
      : Promise.resolve({ data: [] }),
    userIds.length
      ? supabase.from("profiles").select("*").in("id", userIds)
      : Promise.resolve({ data: [] }),
  ]);

  const resumeMap = new Map((resumes ?? []).map((r) => [r.id, r]));
  const applicantMap = new Map((applicants ?? []).map((p) => [p.id, p]));

  return (
    <main className="container-page py-10">
      <h1 className="text-2xl font-bold">{vacancy.title}</h1>
      <p className="mt-1 text-sm text-ink-2">Talent Pipeline — nomzodlarni bosqichma-bosqich boshqaring</p>

      <div className="mt-6">
        <ApplicationKanban
          applications={applications ?? []}
          resumeMap={resumeMap}
          applicantMap={applicantMap}
          vacancySkills={vacancy.skills}
        />
      </div>
    </main>
  );
}
