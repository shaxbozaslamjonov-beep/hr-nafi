"use client";

import { useTransition } from "react";
import { toggleCompanyVerified } from "../actions";
import type { Company } from "@/types/database";

export function CompanyRow({ company }: { company: Company }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className="border-t border-[#e0e3e6]">
      <td className="px-4 py-3 text-[#181c1e]">{company.name}</td>
      <td className="px-4 py-3 text-[#43474d]">{company.industry ?? "—"}</td>
      <td className="px-4 py-3 text-[#43474d]">{company.city ?? "—"}</td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
            company.verified
              ? "bg-[#e6faf3] text-[#007146]"
              : "bg-[#fff8e6] text-[#5e4200]"
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
          className="text-xs font-semibold text-[#0a2540] hover:underline disabled:opacity-50"
        >
          {company.verified ? "Bekor qilish" : "Tasdiqlash"}
        </button>
      </td>
    </tr>
  );
}
