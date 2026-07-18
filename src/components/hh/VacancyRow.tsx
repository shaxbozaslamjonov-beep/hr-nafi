"use client";

import { useTransition } from "react";
import Link from "next/link";
import { updateVacancyStatus } from "@/app/dashboard/hh-actions";
import type { Vacancy } from "@/types/database";

const statusLabels: Record<Vacancy["status"], string> = {
  draft: "Qoralama",
  published: "Faol",
  closed: "Yopilgan",
};

export function VacancyRow({ vacancy }: { vacancy: Vacancy }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className="border-t border-line">
      <td className="px-4 py-3">
        <Link href={`/jobs/${vacancy.id}`} className="font-medium hover:text-brand">
          {vacancy.title}
        </Link>
      </td>
      <td className="px-4 py-3 text-ink-2">{vacancy.city ?? "—"}</td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            vacancy.status === "published"
              ? "bg-success/15 text-success"
              : vacancy.status === "draft"
                ? "bg-warning/15 text-warning"
                : "bg-line text-ink-2"
          }`}
        >
          {statusLabels[vacancy.status]}
        </span>
      </td>
      <td className="px-4 py-3">
        <Link
          href={`/dashboard/employer/vacancies/${vacancy.id}/applications`}
          className="text-xs font-medium text-brand hover:underline"
        >
          Arizalar
        </Link>
      </td>
      <td className="px-4 py-3">
        <select
          defaultValue={vacancy.status}
          disabled={isPending}
          onChange={(e) =>
            startTransition(() =>
              updateVacancyStatus(vacancy.id, e.target.value as Vacancy["status"])
            )
          }
          className="rounded-lg border border-line bg-bg-2 px-2 py-1 text-xs disabled:opacity-50"
        >
          <option value="draft">Qoralama</option>
          <option value="published">Faol</option>
          <option value="closed">Yopilgan</option>
        </select>
      </td>
    </tr>
  );
}
