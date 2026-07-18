import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ManageCoursePage({
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

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .eq("created_by", user.id)
    .single();

  if (!course) {
    redirect("/dashboard/educator");
  }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", id)
    .order("order_index", { ascending: true });

  return (
    <main className="container-page py-10">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p className="mt-1 text-sm text-ink-2">
        {course.level} · {course.hours} soat
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/dashboard/educator/courses/${id}/lessons/new`}
          className="brand-gradient rounded-lg px-4 py-2 text-sm font-semibold text-white"
        >
          + Dars qo&apos;shish
        </Link>
        <Link
          href={`/dashboard/educator/courses/${id}/quiz`}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-card"
        >
          Imtihon savollarini tahrirlash
        </Link>
        <Link
          href={`/courses/${id}`}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-card"
        >
          Ochiq ko&apos;rinish
        </Link>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Darslar</h2>
      <ol className="mt-3 flex flex-col gap-2">
        {(lessons ?? []).map((l, i) => (
          <li key={l.id} className="card flex items-center gap-3 p-3 text-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-card-2 text-xs text-ink-2">
              {i + 1}
            </span>
            {l.title}
          </li>
        ))}
        {(!lessons || lessons.length === 0) && (
          <p className="text-sm text-ink-3">Hali dars qo&apos;shilmagan.</p>
        )}
      </ol>
    </main>
  );
}
