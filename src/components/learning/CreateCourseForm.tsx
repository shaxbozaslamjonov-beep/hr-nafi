"use client";

import { useActionState } from "react";
import { createCourse } from "@/app/dashboard/learning-actions";
import type { FormState } from "@/app/dashboard/learning-actions";

const initialState: FormState = {};

export function CreateCourseForm() {
  const [state, formAction, pending] = useActionState(createCourse, initialState);

  return (
    <div className="card mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Yangi kurs</h1>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="title">
            Kurs nomi
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
            rows={4}
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-ink-2" htmlFor="level">
              Daraja
            </label>
            <select
              id="level"
              name="level"
              defaultValue="Level 1"
              className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
            >
              <option value="Level 1">Level 1 — Beginner</option>
              <option value="Level 2-3">Level 2-3 — Intermediate</option>
              <option value="Level 4-5">Level 4-5 — Expert</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-2" htmlFor="hours">
              Davomiyligi (soat)
            </label>
            <input
              id="hours"
              name="hours"
              type="number"
              min={0}
              defaultValue={40}
              className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        {state.error && <p className="text-sm text-danger">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="brand-gradient mt-2 rounded-lg px-4 py-2.5 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Yaratilmoqda..." : "Kursni yaratish"}
        </button>
      </form>
    </div>
  );
}
