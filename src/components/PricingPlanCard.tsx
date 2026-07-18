"use client";

import { useState, useTransition } from "react";
import { subscribeToPlan } from "@/app/dashboard/payment-actions";
import type { Plan } from "@/types/database";

export function PricingPlanCard({
  plan,
  canSubscribe,
}: {
  plan: Plan;
  canSubscribe: boolean;
}) {
  const [state, setState] = useState<{ error?: string; success?: boolean }>({});
  const [isPending, startTransition] = useTransition();

  return (
    <div className="card flex flex-col p-6">
      <h3 className="text-lg font-semibold">{plan.name}</h3>
      <p className="mt-2">
        <span className="font-heading text-3xl font-bold">
          {plan.price === 0 ? "Bepul" : `$${plan.price}`}
        </span>
        {plan.price > 0 && (
          <span className="text-sm text-ink-2">
            /{plan.billing_period === "monthly" ? "oy" : "bir martalik"}
          </span>
        )}
      </p>

      <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm text-ink-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="text-success">✓</span>
            {f}
          </li>
        ))}
      </ul>

      {state.success ? (
        <p className="mt-6 text-center text-sm font-medium text-success">Faollashtirildi!</p>
      ) : (
        <button
          type="button"
          disabled={!canSubscribe || isPending}
          onClick={() =>
            startTransition(async () => {
              const res = await subscribeToPlan(plan.id);
              setState(res);
            })
          }
          className="brand-gradient mt-6 rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? "Yuklanmoqda..." : "Tanlash"}
        </button>
      )}
      {state.error && <p className="mt-2 text-xs text-danger">{state.error}</p>}
      {!canSubscribe && (
        <p className="mt-2 text-center text-xs text-ink-3">Tanlash uchun tizimga kiring</p>
      )}
    </div>
  );
}
