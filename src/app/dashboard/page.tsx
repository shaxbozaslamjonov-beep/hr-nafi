import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

const roleLabels: Record<UserRole, string> = {
  student: "Talaba",
  employer: "Ish beruvchi",
  entrepreneur: "Tadbirkor",
  educator: "O'qituvchi",
  admin: "Admin",
  superadmin: "Superadmin",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin" || profile?.role === "superadmin") {
    redirect("/admin");
  }
  if (profile?.role === "employer") {
    redirect("/dashboard/employer");
  }
  if (profile?.role === "student") {
    redirect("/dashboard/student");
  }
  if (profile?.role === "educator") {
    redirect("/dashboard/educator");
  }

  const roleLabel = roleLabels[profile?.role ?? "student"];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">
        Xush kelibsiz, {profile?.full_name || user.email}!
      </h1>
      <p className="text-ink-2">
        Rolingiz: <span className="font-semibold text-brand">{roleLabel}</span>
      </p>
      <p className="max-w-md text-sm text-ink-3">
        Bu sizning shaxsiy kabinetingiz. To&apos;liq funksional {roleLabel.toLowerCase()} paneli
        keyingi bosqichlarda quriladi.
      </p>
    </main>
  );
}
