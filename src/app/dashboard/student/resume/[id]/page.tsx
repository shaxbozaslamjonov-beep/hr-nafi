import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResumeForm } from "@/components/hh/ResumeForm";

export default async function EditResumePage({
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

  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!resume) {
    redirect("/dashboard/student");
  }

  return (
    <main className="px-4 py-16">
      <ResumeForm resume={resume} />
    </main>
  );
}
