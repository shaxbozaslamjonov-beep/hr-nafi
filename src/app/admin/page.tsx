import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ count: usersCount }, { count: companiesCount }, { count: blockedCount }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("companies").select("*", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "blocked"),
    ]);

  const stats = [
    { label: "Foydalanuvchilar", value: usersCount ?? 0 },
    { label: "Kompaniyalar", value: companiesCount ?? 0 },
    { label: "Bloklangan foydalanuvchilar", value: blockedCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Statistika</h1>
      <p className="mt-1 text-sm text-ink-2">Platformaning umumiy ko&apos;rsatkichlari</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="font-heading text-3xl font-bold">{s.value}</div>
            <div className="mt-1 text-sm text-ink-2">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
