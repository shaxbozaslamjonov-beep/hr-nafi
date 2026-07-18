"use client";

import { useTransition } from "react";
import { toggleCompanyVerified } from "../actions";
import type { Company } from "@/types/database";

export function CompanyRow({ company }: { company: Company }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className="border-t border-line">
      <td className="px-4 py-3">{company.name}</td>
      <td className="px-4 py-3 text-ink-2">{company.industry ?? "—"}</td>
      <td className="px-4 py-3 text-ink-2">{company.city ?? "—"}</td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            company.verified ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
          }`}
        >
          {company.verified ? "Tasdiqlangan" : "Kutilmoqda"}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(() => toggleCompanyVerified(company.id, !company.verified))
          }
          className="text-xs font-medium text-brand hover:underline disabled:opacity-50"
        >
          {company.verified ? "Bekor qilish" : "Tasdiqlash"}
        </button>
      </td>
    </tr>
  );
}
