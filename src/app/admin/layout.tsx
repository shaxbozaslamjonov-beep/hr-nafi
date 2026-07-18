import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Users, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/(auth)/actions";

const navItems = [
  { href: "/admin", label: "Statistika", icon: LayoutGrid },
  { href: "/admin/users", label: "Foydalanuvchilar", icon: Users },
  { href: "/admin/companies", label: "Kompaniyalar", icon: Building2 },
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
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "superadmin")) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-[#f7fafd] text-[#181c1e]">
      <aside className="hidden w-64 shrink-0 flex-col bg-[#000f22] p-6 sm:flex">
        <div>
          <div className="font-heading text-lg font-bold text-white">
            Educa<span className="text-[#59fead]">Jobs</span>
          </div>
          <div className="mt-0.5 text-xs uppercase tracking-wide text-[#768dad]">
            Intelligence Hub
          </div>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md border-l-4 border-transparent px-3 py-2.5 text-sm font-medium text-[#b0c8eb] transition hover:border-[#59fead] hover:bg-white/5 hover:text-white"
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 pt-4">
          <p className="text-sm font-medium text-white">{profile.full_name ?? "Admin"}</p>
          <p className="text-xs uppercase tracking-wide text-[#59fead]">
            {profile.role === "superadmin" ? "Superadmin" : "Admin"}
          </p>
          <form action={logout} className="mt-3">
            <button
              type="submit"
              className="text-xs font-medium text-[#768dad] hover:text-white"
            >
              Chiqish
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-10">
        <div className="mx-auto max-w-[1440px]">{children}</div>
      </main>
    </div>
  );
}
