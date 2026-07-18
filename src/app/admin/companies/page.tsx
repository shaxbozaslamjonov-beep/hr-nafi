import { createClient } from "@/lib/supabase/server";
import { CompanyRow } from "./CompanyRow";

export default async function AdminCompaniesPage() {
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-[28px] font-semibold tracking-tight text-[#181c1e]">Kompaniyalar</h1>
      <p className="mt-1 text-sm text-[#43474d]">Ish beruvchilar bazasi va tasdiqlash holati</p>

      <div className="mt-6 overflow-hidden overflow-x-auto rounded-lg border border-[#e0e3e6] bg-white shadow-[0_4px_20px_rgba(10,37,64,0.06)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f1f4f7] text-[10px] font-semibold uppercase tracking-wide text-[#43474d]">
            <tr>
              <th className="px-4 py-3">Nomi</th>
              <th className="px-4 py-3">Soha</th>
              <th className="px-4 py-3">Shahar</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {(companies ?? []).map((c) => (
              <CompanyRow key={c.id} company={c} />
            ))}
            {(!companies || companies.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#74777e]">
                  Kompaniyalar topilmadi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
