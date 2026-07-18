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
      <h1 className="text-[28px] font-semibold tracking-tight text-[#181c1e]">
        Foydalanuvchilar
      </h1>
      <p className="mt-1 text-sm text-[#43474d]">
        Ro&apos;yxatdan o&apos;tgan barcha foydalanuvchilar bazasi
      </p>

      <form className="mt-4">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Ism yoki telefon bo'yicha qidirish..."
          className="w-full max-w-xs rounded-lg border border-[#c4c6ce] bg-white px-3 py-2 text-sm text-[#181c1e] focus:border-[#0a2540] focus:outline-none"
        />
      </form>

      <div className="mt-6 overflow-hidden overflow-x-auto rounded-lg border border-[#e0e3e6] bg-white shadow-[0_4px_20px_rgba(10,37,64,0.06)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f1f4f7] text-[10px] font-semibold uppercase tracking-wide text-[#43474d]">
            <tr>
              <th className="px-4 py-3">Ism</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <UserRow key={u.id} user={u} />
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#74777e]">
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
