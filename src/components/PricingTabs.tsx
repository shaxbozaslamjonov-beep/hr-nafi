"use client";

import { useState } from "react";
import { PricingPlanCard } from "@/components/PricingPlanCard";
import type { Plan } from "@/types/database";

const roleLabels: Record<Plan["target_role"], string> = {
  student: "Talaba",
  employer: "Ish beruvchi",
  entrepreneur: "Tadbirkor",
};

export function PricingTabs({
  plansByRole,
  defaultRole,
  canSubscribe,
}: {
  plansByRole: Record<Plan["target_role"], Plan[]>;
  defaultRole: Plan["target_role"];
  canSubscribe: boolean;
}) {
  const [role, setRole] = useState<Plan["target_role"]>(defaultRole);

  return (
    <div>
      <div className="flex justify-center gap-1 rounded-full bg-card p-1">
        {(Object.keys(roleLabels) as Plan["target_role"][]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              role === r ? "bg-brand text-white" : "text-ink-2 hover:text-ink"
            }`}
          >
            {roleLabels[r]}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {(plansByRole[role] ?? []).map((plan) => (
          <PricingPlanCard key={plan.id} plan={plan} canSubscribe={canSubscribe} />
        ))}
      </div>
    </div>
  );
}
