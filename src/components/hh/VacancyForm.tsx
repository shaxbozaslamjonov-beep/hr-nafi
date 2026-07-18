"use client";

import { useActionState } from "react";
import { createVacancy, type FormState } from "@/app/dashboard/hh-actions";

const initialState: FormState = {};

const employmentTypes = [
  { value: "full_time", label: "To'liq stavka" },
  { value: "part_time", label: "Yarim stavka" },
  { value: "remote", label: "Masofaviy" },
  { value: "internship", label: "Amaliyot" },
  { value: "project", label: "Loyihaviy" },
];

export function VacancyForm({ companyId }: { companyId: string }) {
  const [state, formAction, pending] = useActionState(createVacancy, initialState);

  return (
    <div className="card mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Yangi vakansiya</h1>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="company_id" value={companyId} />

        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="title">
            Lavozim nomi
          </label>
          <input
            id="title"
            name="title"
            required
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="description">
            Tavsif
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-ink-2" htmlFor="salary_min">
              Maosh (dan)
            </label>
            <input
              id="salary_min"
              name="salary_min"
              type="number"
              min={0}
              className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-2" htmlFor="salary_max">
              Maosh (gacha)
            </label>
            <input
              id="salary_max"
              name="salary_max"
              type="number"
              min={0}
              className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-ink-2" htmlFor="employment_type">
              Ish turi
            </label>
            <select
              id="employment_type"
              name="employment_type"
              defaultValue="full_time"
              className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
            >
              {employmentTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
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
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="skills">
            Ko&apos;nikmalar (vergul bilan ajrating)
          </label>
          <input
            id="skills"
            name="skills"
            placeholder="React, TypeScript, Node.js"
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>

        {state.error && <p className="text-sm text-danger">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="brand-gradient mt-2 rounded-lg px-4 py-2.5 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Joylanmoqda..." : "Vakansiyani joylash"}
        </button>
      </form>
    </div>
  );
}
