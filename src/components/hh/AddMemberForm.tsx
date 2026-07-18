"use client";

import { useActionState } from "react";
import { addCompanyMember } from "@/app/dashboard/hh-actions";
import type { FormState } from "@/app/dashboard/hh-actions";

const initialState: FormState = {};

export function AddMemberForm({ companyId }: { companyId: string }) {
  const [state, formAction, pending] = useActionState(
    addCompanyMember.bind(null, companyId),
    initialState
  );

  return (
    <form action={formAction} className="card flex flex-wrap items-end gap-3 p-4">
      <div className="flex-1">
        <label className="mb-1 block text-sm text-ink-2" htmlFor="phone">
          Xodim telefon raqami
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="+998 90 123-45-67"
          className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
        />
        <p className="mt-1 text-xs text-ink-3">
          Xodim avval platformada ro&apos;yxatdan o&apos;tgan bo&apos;lishi kerak.
        </p>
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.success && <p className="text-sm text-success">Qo&apos;shildi!</p>}

      <button
        type="submit"
        disabled={pending}
        className="brand-gradient rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Qo'shilmoqda..." : "Qo'shish"}
      </button>
    </form>
  );
}
