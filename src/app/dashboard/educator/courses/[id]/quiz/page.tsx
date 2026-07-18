import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuizEditor } from "@/components/learning/QuizEditor";

export default async function QuizEditorPage({
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
    .select("id, title")
    .eq("id", id)
    .eq("created_by", user.id)
    .single();

  if (!course) {
    redirect("/dashboard/educator");
  }

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("*")
    .eq("course_id", id)
    .maybeSingle();

  return (
    <main className="container-page max-w-2xl py-10">
      <h1 className="text-2xl font-bold">{course.title} — Imtihon savollari</h1>
      <div className="mt-6">
        <QuizEditor
          courseId={id}
          initialQuestions={quiz?.questions ?? []}
          initialPassingScore={quiz?.passing_score ?? 70}
        />
      </div>
    </main>
  );
}
