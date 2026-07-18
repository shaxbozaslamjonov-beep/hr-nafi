import Link from "next/link";
import { logout } from "@/app/(auth)/actions";
import { createClient } from "@/lib/supabase/server";
import { NotificationBell } from "@/components/NotificationBell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notifications } = user
    ? await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)
    : { data: [] };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/" className="font-heading text-lg font-bold">
            Educa<span className="text-gold">Jobs</span>
          </Link>
          <div className="flex items-center gap-3">
            <NotificationBell notifications={notifications ?? []} />
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium hover:bg-card"
              >
                Chiqish
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
