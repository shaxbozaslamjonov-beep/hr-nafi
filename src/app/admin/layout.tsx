import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/admin", label: "Statistika" },
  { href: "/admin/users", label: "Foydalanuvchilar" },
  { href: "/admin/companies", label: "Kompaniyalar" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "superadmin")) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-line p-6 sm:block">
        <Link href="/admin" className="font-heading text-lg font-bold">
          Educa<span className="text-gold">Jobs</span>
        </Link>
        <div className="mt-1 text-xs text-ink-3">Superadmin panel</div>

        <nav className="mt-8 flex flex-col gap-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-ink-2 transition hover:bg-card hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}
