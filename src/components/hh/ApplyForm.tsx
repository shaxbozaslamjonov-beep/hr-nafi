"use client";

import { useActionState } from "react";
import { applyToVacancy, type FormState } from "@/app/dashboard/hh-actions";
import type { Resume } from "@/types/database";

const initialState: FormState = {};

export function ApplyForm({ vacancyId, resumes }: { vacancyId: string; resumes: Resume[] }) {
  const [state, formAction, pending] = useActionState(applyToVacancy, initialState);

  if (state.success) {
    return (
      <div className="card p-6">
        <p className="font-medium text-success">Arizangiz muvaffaqiyatli yuborildi!</p>
        <p className="mt-1 text-sm text-ink-2">
          Natijani &quot;Mening arizalarim&quot; bo&apos;limida kuzatishingiz mumkin.
        </p>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="card p-6">
        <p className="text-sm text-ink-2">
          Ariza berish uchun avval rezyume yarating.
        </p>
        <a
          href="/dashboard/student/resume/new"
          className="brand-gradient mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white"
        >
          Rezyume yaratish
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="card flex flex-col gap-4 p-6">
      <input type="hidden" name="vacancy_id" value={vacancyId} />

      <div>
        <label className="mb-1 block text-sm text-ink-2" htmlFor="resume_id">
          Rezyume tanlang
        </label>
        <select
          id="resume_id"
          name="resume_id"
          required
          className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
        >
          {resumes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink-2" htmlFor="cover_letter">
          Xat (ixtiyoriy)
        </label>
        <textarea
          id="cover_letter"
          name="cover_letter"
          rows={4}
          className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
        />
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="brand-gradient rounded-lg px-4 py-2.5 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Yuborilmoqda..." : "Ariza yuborish"}
      </button>
    </form>
  );
}
