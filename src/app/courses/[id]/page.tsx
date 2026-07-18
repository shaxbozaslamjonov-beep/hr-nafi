import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { enrollInCourse } from "@/app/dashboard/learning-actions";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (!course) {
    notFound();
  }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", id)
    .order("order_index", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isEnrolled = false;
  if (user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", id)
      .maybeSingle();
    isEnrolled = Boolean(enrollment);
  }

  const enrollAction = enrollInCourse.bind(null, course.id);

  return (
    <main className="container-page grid gap-8 py-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <span className="rounded-full bg-card-2 px-2.5 py-1 text-xs text-ink-2">{course.level}</span>
        <h1 className="mt-3 text-3xl font-bold">{course.title}</h1>
        <p className="mt-2 text-ink-2">{course.hours} soat · {(lessons ?? []).length} dars</p>

        {course.description && (
          <div className="card mt-6 whitespace-pre-line p-6 text-sm text-ink-2">
            {course.description}
          </div>
        )}

        <h2 className="mt-8 text-lg font-semibold">Dastur tarkibi</h2>
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
            <p className="text-sm text-ink-3">Darslar hali qo&apos;shilmagan.</p>
          )}
        </ol>
      </div>

      <div>
        <div className="card p-6 text-center">
          {!user && (
            <>
              <p className="text-sm text-ink-2">Kursni boshlash uchun tizimga kiring.</p>
              <Link
                href="/login"
                className="brand-gradient mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white"
              >
                Kirish
              </Link>
            </>
          )}

          {user && isEnrolled && (
            <Link
              href={`/learn/${course.id}`}
              className="brand-gradient inline-block w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
            >
              Davom ettirish
            </Link>
          )}

          {user && !isEnrolled && (
            <form action={enrollAction}>
              <button
                type="submit"
                className="brand-gradient w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
              >
                Kursni boshlash
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
