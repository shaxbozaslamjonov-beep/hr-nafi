"use client";

import { useActionState } from "react";
import { createLesson } from "@/app/dashboard/learning-actions";
import type { FormState } from "@/app/dashboard/learning-actions";

const initialState: FormState = {};

export function LessonForm({ courseId, nextOrder }: { courseId: string; nextOrder: number }) {
  const [state, formAction, pending] = useActionState(createLesson, initialState);

  return (
    <div className="card mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Yangi dars</h1>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="course_id" value={courseId} />
        <input type="hidden" name="order_index" value={nextOrder} />

        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="title">
            Dars nomi
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="Dars 1: Kirish"
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="content">
            Dars matni
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="video_url">
            Video havolasi (ixtiyoriy)
          </label>
          <input
            id="video_url"
            name="video_url"
            type="url"
            placeholder="https://..."
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>

        {state.error && <p className="text-sm text-danger">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="brand-gradient mt-2 rounded-lg px-4 py-2.5 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saqlanmoqda..." : "Darsni saqlash"}
        </button>
      </form>
    </div>
  );
}
