import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Foydalanuvchining kompaniyasini topadi — u kompaniya egasi bo'lsa ham,
// kompaniya jamoasi a'zosi (xodim) bo'lsa ham ishlaydi.
export async function getEmployerCompany(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { data: ownedCompany } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();

  if (ownedCompany) return ownedCompany;

  const { data: membership } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!membership) return null;

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", membership.company_id)
    .single();

  return company;
}
