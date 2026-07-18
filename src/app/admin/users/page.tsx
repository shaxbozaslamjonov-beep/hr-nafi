import { createClient } from "@/lib/supabase/server";
import { UserRow } from "./UserRow";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (q) {
    query = query.or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`);
  }
  const { data: users } = await query;

  return (
    <div>
      <h1 className="text-2xl font-bold">Foydalanuvchilar</h1>
      <p className="mt-1 text-sm text-ink-2">Ro&apos;yxatdan o&apos;tgan barcha foydalanuvchilar bazasi</p>

      <form className="mt-4">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Ism yoki telefon bo'yicha qidirish..."
          className="w-full max-w-xs rounded-lg border border-line bg-bg-2 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-ink-2">
            <tr>
              <th className="px-4 py-3 font-medium">Ism</th>
              <th className="px-4 py-3 font-medium">Telefon</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Holat</th>
              <th className="px-4 py-3 font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <UserRow key={u.id} user={u} />
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-3">
                  Foydalanuvchilar topilmadi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
