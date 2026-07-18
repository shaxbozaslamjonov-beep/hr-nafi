"use client";

import { useState, useTransition } from "react";
import { toggleSavedVacancy } from "@/app/dashboard/hh-actions";

export function SaveVacancyButton({
  vacancyId,
  initiallySaved,
}: {
  vacancyId: string;
  initiallySaved: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        const next = !saved;
        setSaved(next);
        startTransition(() => toggleSavedVacancy(vacancyId, saved));
      }}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
        saved ? "border-brand bg-brand/10 text-brand" : "border-line text-ink-2 hover:text-ink"
      }`}
    >
      {saved ? "Saqlangan ✓" : "Saqlash"}
    </button>
  );
}
