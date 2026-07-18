import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function EducatorDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Mening kurslarim</h1>
        <Link
          href="/dashboard/educator/courses/new"
          className="brand-gradient rounded-lg px-4 py-2 text-sm font-semibold text-white"
        >
          + Yangi kurs
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(courses ?? []).map((c) => (
          <Link
            key={c.id}
            href={`/dashboard/educator/courses/${c.id}`}
            className="card block p-5 hover:border-brand"
          >
            <h2 className="font-semibold">{c.title}</h2>
            <p className="mt-1 text-sm text-ink-2">
              {c.level} · {c.hours} soat
            </p>
          </Link>
        ))}
        {(!courses || courses.length === 0) && (
          <p className="col-span-2 py-10 text-center text-ink-3">
            Hali kurs yaratmagansiz.
          </p>
        )}
      </div>
    </main>
  );
}
