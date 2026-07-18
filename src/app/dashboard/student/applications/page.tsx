import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/types/database";

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "Kutilmoqda",
  viewed: "Ko'rildi",
  invited: "Suhbatga taklif",
  rejected: "Rad etildi",
  accepted: "Qabul qilindi",
};

export default async function StudentApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const vacancyIds = [...new Set((applications ?? []).map((a) => a.vacancy_id))];
  const { data: vacancies } = vacancyIds.length
    ? await supabase.from("vacancies").select("*").in("id", vacancyIds)
    : { data: [] };
  const vacancyMap = new Map((vacancies ?? []).map((v) => [v.id, v]));

  return (
    <main className="container-page py-10">
      <h1 className="text-2xl font-bold">Mening arizalarim</h1>

      <div className="mt-6 flex flex-col gap-3">
        {(applications ?? []).map((a) => {
          const vacancy = vacancyMap.get(a.vacancy_id);
          return (
            <div key={a.id} className="card flex items-center justify-between gap-4 p-4">
              <div>
                <Link
                  href={`/jobs/${a.vacancy_id}`}
                  className="font-medium hover:text-brand"
                >
                  {vacancy?.title ?? "Vakansiya topilmadi"}
                </Link>
                <p className="mt-1 text-sm text-ink-2">{vacancy?.city}</p>
              </div>
              <span
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs ${
                  a.status === "accepted"
                    ? "bg-success/15 text-success"
                    : a.status === "rejected"
                      ? "bg-danger/15 text-danger"
                      : "bg-card-2 text-ink-2"
                }`}
              >
                {statusLabels[a.status]}
              </span>
            </div>
          );
        })}
        {(!applications || applications.length === 0) && (
          <p className="py-10 text-center text-ink-3">Hali hech qanday vakansiyaga ariza bermagansiz.</p>
        )}
      </div>
    </main>
  );
}
