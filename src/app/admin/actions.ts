"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function updateUserRole(userId: string, role: UserRole) {
  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/admin/users");
}

export async function toggleUserStatus(userId: string, status: "active" | "blocked") {
  const supabase = await createClient();
  await supabase.from("profiles").update({ status }).eq("id", userId);
  revalidatePath("/admin/users");
}

export async function toggleCompanyVerified(companyId: string, verified: boolean) {
  const supabase = await createClient();
  await supabase.from("companies").update({ verified }).eq("id", companyId);
  revalidatePath("/admin/companies");
}
