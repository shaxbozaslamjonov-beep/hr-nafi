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
      <h1 className="text-2xl font-bold">Kompaniyalar</h1>
      <p className="mt-1 text-sm text-ink-2">Ish beruvchilar bazasi va tasdiqlash holati</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-ink-2">
            <tr>
              <th className="px-4 py-3 font-medium">Nomi</th>
              <th className="px-4 py-3 font-medium">Soha</th>
              <th className="px-4 py-3 font-medium">Shahar</th>
              <th className="px-4 py-3 font-medium">Holat</th>
              <th className="px-4 py-3 font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {(companies ?? []).map((c) => (
              <CompanyRow key={c.id} company={c} />
            ))}
            {(!companies || companies.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-3">
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
