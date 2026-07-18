import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ExamForm } from "@/components/learning/ExamForm";

export default async function ExamPage({
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
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("*")
    .eq("course_id", courseId)
    .single();

  if (!quiz || quiz.questions.length === 0) {
    return (
      <main className="container-page max-w-xl py-16 text-center">
        <p className="text-ink-2">Bu kurs uchun imtihon hali tayyorlanmagan.</p>
      </main>
    );
  }

  // Javob kalitini (answer_index) hech qachon mijozga yubormaymiz.
  const publicQuestions = quiz.questions.map(({ q, options }) => ({ q, options }));

  return (
    <main className="container-page max-w-2xl py-10">
      <h1 className="text-2xl font-bold">Imtihon</h1>
      <p className="mt-1 text-sm text-ink-2">
        O&apos;tish balli: {quiz.passing_score}%. Barcha savollarga javob bering.
      </p>
      <div className="mt-6">
        <ExamForm courseId={courseId} questions={publicQuestions} passingScore={quiz.passing_score} />
      </div>
    </main>
  );
}
