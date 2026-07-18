import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <main className="container-page py-10">
      <h1 className="text-2xl font-bold">Kurslar</h1>
      <p className="mt-1 text-sm text-ink-2">
        Kasbga tayyorlaydigan kurslar, sertifikat va ko&apos;nikma nazorati bilan.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(courses ?? []).map((c) => (
          <Link key={c.id} href={`/courses/${c.id}`} className="card block p-5 hover:border-brand">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-card-2 px-2.5 py-1 text-xs text-ink-2">{c.level}</span>
              <span className="text-xs text-ink-3">{c.hours} soat</span>
            </div>
            <h2 className="mt-3 text-lg font-semibold">{c.title}</h2>
            {c.description && (
              <p className="mt-2 line-clamp-2 text-sm text-ink-2">{c.description}</p>
            )}
          </Link>
        ))}

        {(!courses || courses.length === 0) && (
          <p className="col-span-full py-16 text-center text-ink-3">
            Hozircha kurslar mavjud emas.
          </p>
        )}
      </div>
    </main>
  );
}
