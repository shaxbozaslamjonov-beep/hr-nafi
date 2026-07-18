"use client";

import { useActionState } from "react";
import { createCompany, type FormState } from "@/app/dashboard/hh-actions";

const initialState: FormState = {};

export function CreateCompanyForm() {
  const [state, formAction, pending] = useActionState(createCompany, initialState);

  return (
    <div className="card mx-auto max-w-lg p-8">
      <h1 className="text-2xl font-bold">Kompaniyangizni yarating</h1>
      <p className="mt-1 text-sm text-ink-2">
        Vakansiya joylashtirish uchun avval kompaniya profilini to&apos;ldiring.
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="name">
            Kompaniya nomi
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="industry">
            Soha
          </label>
          <input
            id="industry"
            name="industry"
            placeholder="IT, Ishlab chiqarish, Savdo..."
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="city">
            Shahar
          </label>
          <input
            id="city"
            name="city"
            defaultValue="Samarqand"
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="description">
            Qisqacha tavsif
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>

        {state.error && <p className="text-sm text-danger">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="brand-gradient mt-2 rounded-lg px-4 py-2.5 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Yaratilmoqda..." : "Kompaniyani yaratish"}
        </button>
      </form>
    </div>
  );
}
