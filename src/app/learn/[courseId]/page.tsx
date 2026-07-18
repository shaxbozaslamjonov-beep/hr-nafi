import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { markLessonViewed } from "@/app/dashboard/learning-actions";

export default async function LearnCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  const total = (lessons ?? []).length;

  return (
    <main className="container-page py-10">
      <h1 className="text-2xl font-bold">{course?.title}</h1>

      <div className="card mt-4 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-2">Progress</span>
          <span className="font-semibold">{enrollment.progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
          <div
            className="brand-gradient h-full"
            style={{ width: `${enrollment.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {(lessons ?? []).map((lesson, i) => {
          const progress = Math.round(((i + 1) / total) * 100);
          const viewedAction = markLessonViewed.bind(null, courseId, progress);
          const isViewed = enrollment.progress >= progress;

          return (
            <div key={lesson.id} className="card p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold">
                  {i + 1}. {lesson.title}
                </h2>
                {isViewed ? (
                  <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs text-success">
                    O&apos;qildi
                  </span>
                ) : (
                  <form action={viewedAction}>
                    <button
                      type="submit"
                      className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium hover:bg-card"
                    >
                      O&apos;qidim deb belgilash
                    </button>
                  </form>
                )}
              </div>
              {lesson.content && (
                <p className="mt-3 whitespace-pre-line text-sm text-ink-2">{lesson.content}</p>
              )}
              {lesson.video_url && (
                <a
                  href={lesson.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm text-brand hover:underline"
                >
                  Video darsni ko&apos;rish →
                </a>
              )}
            </div>
          );
        })}
      </div>

      <div className="card mt-8 p-6 text-center">
        <p className="text-sm text-ink-2">
          Barcha darslarni tugatgach, imtihon topshirib sertifikat oling.
        </p>
        <Link
          href={`/learn/${courseId}/exam`}
          className="brand-gradient mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white"
        >
          Imtihonni boshlash
        </Link>
      </div>
    </main>
  );
}
