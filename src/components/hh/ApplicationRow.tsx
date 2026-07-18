"use client";

import { useTransition } from "react";
import { updateApplicationStatus } from "@/app/dashboard/hh-actions";
import { computeMatchScore } from "@/lib/match";
import type { Application, ApplicationStatus, Profile, Resume } from "@/types/database";

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "Kutilmoqda",
  viewed: "Ko'rildi",
  invited: "Suhbatga taklif",
  rejected: "Rad etildi",
  accepted: "Qabul qilindi",
};

export function ApplicationRow({
  application,
  resume,
  applicant,
  vacancySkills,
}: {
  application: Application;
  resume?: Resume;
  applicant?: Profile;
  vacancySkills: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const matchScore = resume ? computeMatchScore(resume.skills, vacancySkills) : null;

  return (
    <tr className="border-t border-line align-top">
      <td className="px-4 py-3">
        <div className="font-medium">{applicant?.full_name ?? "Noma'lum"}</div>
        <div className="text-xs text-ink-2">{applicant?.phone ?? "—"}</div>
      </td>
      <td className="px-4 py-3">
        <div className="font-medium">{resume?.title ?? "—"}</div>
        <div className="text-xs text-ink-2">{resume?.position ?? ""}</div>
        {matchScore !== null && (
          <div className="mt-1 text-xs font-medium text-brand">Moslik: {matchScore}%</div>
        )}
      </td>
      <td className="max-w-xs px-4 py-3 text-ink-2">{application.cover_letter ?? "—"}</td>
      <td className="px-4 py-3">
        <select
          defaultValue={application.status}
          disabled={isPending}
          onChange={(e) =>
            startTransition(() =>
              updateApplicationStatus(application.id, e.target.value as ApplicationStatus)
            )
          }
          className="rounded-lg border border-line bg-bg-2 px-2 py-1 text-xs disabled:opacity-50"
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}
