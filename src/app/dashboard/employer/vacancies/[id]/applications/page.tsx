import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplicationRow } from "@/components/hh/ApplicationRow";

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
      <p className="mt-1 text-sm text-ink-2">Ushbu vakansiyaga kelgan arizalar</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-ink-2">
            <tr>
              <th className="px-4 py-3 font-medium">Nomzod</th>
              <th className="px-4 py-3 font-medium">Rezyume</th>
              <th className="px-4 py-3 font-medium">Xat</th>
              <th className="px-4 py-3 font-medium">Holat</th>
            </tr>
          </thead>
          <tbody>
            {(applications ?? []).map((a) => (
              <ApplicationRow
                key={a.id}
                application={a}
                resume={resumeMap.get(a.resume_id)}
                applicant={applicantMap.get(a.user_id)}
                vacancySkills={vacancy.skills}
              />
            ))}
            {(!applications || applications.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-3">
                  Hali ariza tushmagan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
