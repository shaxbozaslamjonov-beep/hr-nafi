"use client";

import { useTransition } from "react";
import { removeCompanyMember } from "@/app/dashboard/hh-actions";
import type { CompanyMember, Profile } from "@/types/database";

export function MemberRow({
  member,
  profile,
  canManage,
}: {
  member: CompanyMember;
  profile?: Profile;
  canManage: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="card flex items-center justify-between gap-4 p-4">
      <div>
        <p className="font-medium">{profile?.full_name ?? "Foydalanuvchi"}</p>
        <p className="text-sm text-ink-2">{profile?.phone}</p>
      </div>
      {canManage && member.role !== "owner" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => removeCompanyMember(member.id))}
          className="text-xs font-medium text-danger hover:underline disabled:opacity-50"
        >
          Olib tashlash
        </button>
      )}
    </div>
  );
}
