import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ResumePrintPage({
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto max-w-2xl bg-white px-10 py-12 text-black print:px-0 print:py-0">
      <div className="flex items-center justify-between border-b border-gray-300 pb-4 print:hidden">
        <p className="text-sm text-gray-500">Chop etish uchun brauzeringizning Print (Ctrl+P) funksiyasidan foydalaning.</p>
      </div>

      <h1 className="mt-6 text-3xl font-bold">{profile?.full_name ?? "Foydalanuvchi"}</h1>
      <p className="mt-1 text-lg text-gray-700">{resume.position ?? resume.title}</p>
      <p className="mt-1 text-sm text-gray-500">{profile?.phone}</p>

      {resume.salary_expect && (
        <p className="mt-4 text-sm">
          <strong>Kutilayotgan maosh:</strong> {resume.salary_expect.toLocaleString("ru-RU")} so&apos;m
        </p>
      )}

      {resume.skills.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Ko&apos;nikmalar
          </h2>
          <p className="mt-2">{resume.skills.join(", ")}</p>
        </div>
      )}

      {resume.experience && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Tajriba
          </h2>
          <p className="mt-2 whitespace-pre-line">{resume.experience}</p>
        </div>
      )}
    </main>
  );
}
