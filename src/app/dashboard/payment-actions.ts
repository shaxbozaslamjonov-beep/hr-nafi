"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface FormState {
  error?: string;
  success?: boolean;
}

// DIQQAT: bu hozircha DEMO checkout — haqiqiy to'lov tizimi (Payme/Click/Uzum)
// hali ulanmagan. Tanlangan reja darhol "active" qilib belgilanadi, real
// pul o'tkazilmaydi. Productionga chiqishda bu funksiya haqiqiy to'lov
// gateway callback'iga almashtirilishi kerak.
export async function subscribeToPlan(planId: string): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: plan } = await supabase.from("plans").select("*").eq("id", planId).single();
  if (!plan) {
    return { error: "Tarif topilmadi" };
  }

  const startsAt = new Date();
  const expiresAt =
    plan.billing_period === "monthly"
      ? new Date(startsAt.getTime() + 30 * 24 * 60 * 60 * 1000)
      : null;

  const { error } = await supabase.from("subscriptions").insert({
    user_id: user.id,
    plan_id: planId,
    status: "active",
    starts_at: startsAt.toISOString(),
    expires_at: expiresAt?.toISOString() ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  await supabase.from("profiles").update({ tier: plan.code }).eq("id", user.id);

  revalidatePath("/pricing");
  revalidatePath("/dashboard");
  return { success: true };
}
