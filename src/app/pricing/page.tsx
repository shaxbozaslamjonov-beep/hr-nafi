import { createClient } from "@/lib/supabase/server";
import { PricingTabs } from "@/components/PricingTabs";
import type { Plan } from "@/types/database";

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: plans } = await supabase.from("plans").select("*").order("price", { ascending: true });

  const plansByRole: Record<Plan["target_role"], Plan[]> = {
    student: [],
    employer: [],
    entrepreneur: [],
  };
  for (const plan of plans ?? []) {
    plansByRole[plan.target_role].push(plan);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let defaultRole: Plan["target_role"] = "student";
  let canSubscribe = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (
      profile?.role === "student" ||
      profile?.role === "employer" ||
      profile?.role === "entrepreneur"
    ) {
      defaultRole = profile.role;
      canSubscribe = true;
    }
  }

  return (
    <main className="container-page py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Tariflar</h1>
        <p className="mt-2 text-ink-2">O&apos;zingizga mos rejani tanlang</p>
        <p className="mt-1 text-xs text-warning">
          Demo rejim — haqiqiy to&apos;lov tizimi hali ulanmagan
        </p>
      </div>

      <div className="mt-8">
        <PricingTabs plansByRole={plansByRole} defaultRole={defaultRole} canSubscribe={canSubscribe} />
      </div>
    </main>
  );
}
