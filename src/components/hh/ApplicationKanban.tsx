"use client";

import { useTransition } from "react";
import { updateApplicationStatus } from "@/app/dashboard/hh-actions";
import { computeMatchScore } from "@/lib/match";
import type { Application, ApplicationStatus, Profile, Resume } from "@/types/database";

type Column = {
  key: ApplicationStatus | "pending_viewed";
  title: string;
  accent: string;
  statuses: ApplicationStatus[];
};

const columns: Column[] = [
  { key: "pending_viewed", title: "Kutilmoqda", accent: "#74777e", statuses: ["pending", "viewed"] },
  { key: "invited", title: "Suhbatga taklif", accent: "#ffba20", statuses: ["invited"] },
  { key: "accepted", title: "Qabul qilindi", accent: "#00d084", statuses: ["accepted"] },
  { key: "rejected", title: "Rad etildi", accent: "#ba1a1a", statuses: ["rejected"] },
];

export function ApplicationKanban({
  applications,
  resumeMap,
  applicantMap,
  vacancySkills,
}: {
  applications: Application[];
  resumeMap: Map<string, Resume>;
  applicantMap: Map<string, Profile>;
  vacancySkills: string[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {columns.map((col) => {
        const items = applications.filter((a) => col.statuses.includes(a.status));
        return (
          <div key={col.key}>
            <div className="flex items-center gap-2 pb-3">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: col.accent }}
              />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#43474d]">
                {col.title}
              </h3>
              <span className="rounded-full bg-[#f1f4f7] px-2 py-0.5 text-xs text-[#43474d]">
                {items.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((a) => (
                <ApplicationCard
                  key={a.id}
                  application={a}
                  resume={resumeMap.get(a.resume_id)}
                  applicant={applicantMap.get(a.user_id)}
                  vacancySkills={vacancySkills}
                  accent={col.accent}
                />
              ))}
              {items.length === 0 && (
                <p className="rounded-lg border border-dashed border-[#c4c6ce] p-4 text-center text-xs text-[#74777e]">
                  Bo&apos;sh
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ApplicationCard({
  application,
  resume,
  applicant,
  vacancySkills,
  accent,
}: {
  application: Application;
  resume?: Resume;
  applicant?: Profile;
  vacancySkills: string[];
  accent: string;
}) {
  const [isPending, startTransition] = useTransition();
  const matchScore = resume ? computeMatchScore(resume.skills, vacancySkills) : null;

  function move(status: ApplicationStatus) {
    startTransition(() => updateApplicationStatus(application.id, status));
  }

  return (
    <div
      className="rounded-lg border border-[#e0e3e6] bg-white p-4 shadow-[0_4px_20px_rgba(10,37,64,0.06)]"
      style={{ borderLeftWidth: 4, borderLeftColor: accent }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-[#181c1e]">{applicant?.full_name ?? "Noma'lum"}</p>
        {matchScore !== null && (
          <span className="whitespace-nowrap rounded-full bg-[#e6faf3] px-2 py-0.5 text-[10px] font-semibold text-[#007146]">
            {matchScore}% Fit
          </span>
        )}
      </div>
      <p className="text-xs text-[#43474d]">{applicant?.phone}</p>

      {resume && (
        <p className="mt-2 text-sm text-[#181c1e]">
          {resume.title}
          {resume.position && <span className="text-[#43474d]"> · {resume.position}</span>}
        </p>
      )}

      {application.cover_letter && (
        <p className="mt-2 line-clamp-3 text-xs text-[#43474d]">{application.cover_letter}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(["pending", "invited", "accepted", "rejected"] as ApplicationStatus[])
          .filter((s) => s !== application.status)
          .map((s) => (
            <button
              key={s}
              type="button"
              disabled={isPending}
              onClick={() => move(s)}
              className="rounded-md border border-[#c4c6ce] px-2 py-1 text-[11px] font-medium text-[#43474d] hover:border-[#0a2540] hover:text-[#0a2540] disabled:opacity-50"
            >
              → {statusLabel(s)}
            </button>
          ))}
      </div>
    </div>
  );
}

function statusLabel(status: ApplicationStatus) {
  const labels: Record<ApplicationStatus, string> = {
    pending: "Kutilmoqda",
    viewed: "Ko'rildi",
    invited: "Taklif",
    rejected: "Rad etish",
    accepted: "Qabul",
  };
  return labels[status];
}
