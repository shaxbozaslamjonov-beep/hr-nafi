import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const courseIds = [...new Set((enrollments ?? []).map((e) => e.course_id))];
  const { data: courses } = courseIds.length
    ? await supabase.from("courses").select("*").in("id", courseIds)
    : { data: [] };
  const courseMap = new Map((courses ?? []).map((c) => [c.id, c]));

  return (
    <main className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Mening kurslarim</h1>
        <div className="flex gap-3">
          <Link
            href="/courses"
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-card"
          >
            Kurslarni ko&apos;rish
          </Link>
          <Link
            href="/dashboard/student/certificates"
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-card"
          >
            Sertifikatlarim
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(enrollments ?? []).map((e) => (
          <Link
            key={e.id}
            href={`/learn/${e.course_id}`}
            className="card block p-5 transition hover:border-brand"
          >
            <h2 className="font-semibold">{courseMap.get(e.course_id)?.title ?? "Kurs"}</h2>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
              <div className="brand-gradient h-full" style={{ width: `${e.progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-ink-2">{e.progress}% tugallandi</p>
          </Link>
        ))}
        {(!enrollments || enrollments.length === 0) && (
          <p className="col-span-2 py-6 text-center text-ink-3">
            Hali kursga yozilmagansiz.
          </p>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Mening rezyumelarim</h2>
        <div className="flex gap-3">
          <Link
            href="/dashboard/student/saved"
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-card"
          >
            Saqlanganlar
          </Link>
          <Link
            href="/dashboard/student/applications"
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-card"
          >
            Arizalarim
          </Link>
          <Link
            href="/dashboard/student/resume/new"
            className="brand-gradient rounded-lg px-4 py-2 text-sm font-semibold text-white"
          >
            + Yangi rezyume
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(resumes ?? []).map((r) => (
          <Link
            key={r.id}
            href={`/dashboard/student/resume/${r.id}`}
            className="card block p-5 transition hover:border-brand"
          >
            <h2 className="font-semibold">{r.title}</h2>
            <p className="mt-1 text-sm text-ink-2">{r.position ?? "Lavozim ko'rsatilmagan"}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.skills.slice(0, 4).map((s) => (
                <span key={s} className="rounded-full bg-card-2 px-2 py-0.5 text-xs text-ink-2">
                  {s}
                </span>
              ))}
            </div>
          </Link>
        ))}
        {(!resumes || resumes.length === 0) && (
          <p className="col-span-2 py-10 text-center text-ink-3">
            Hali rezyume yaratmagansiz. &quot;+ Yangi rezyume&quot; tugmasini bosing.
          </p>
        )}
      </div>
    </main>
  );
}
