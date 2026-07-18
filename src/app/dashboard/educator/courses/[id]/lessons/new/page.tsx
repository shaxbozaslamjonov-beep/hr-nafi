import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonForm } from "@/components/learning/LessonForm";

export default async function NewLessonPage({
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
    .select("id")
    .eq("id", id)
    .eq("created_by", user.id)
    .single();

  if (!course) {
    redirect("/dashboard/educator");
  }

  const { count } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("course_id", id);

  return (
    <main className="px-4 py-16">
      <LessonForm courseId={id} nextOrder={count ?? 0} />
    </main>
  );
}
