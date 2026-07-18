"use client";

import { useTransition } from "react";
import { updateUserRole, toggleUserStatus } from "../actions";
import type { Profile, UserRole } from "@/types/database";

const roles: UserRole[] = [
  "student",
  "employer",
  "entrepreneur",
  "educator",
  "admin",
  "superadmin",
];

export function UserRow({ user }: { user: Profile }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className="border-t border-[#e0e3e6]">
      <td className="px-4 py-3 text-[#181c1e]">{user.full_name ?? "—"}</td>
      <td className="px-4 py-3 text-[#43474d]">{user.phone ?? "—"}</td>
      <td className="px-4 py-3">
        <select
          defaultValue={user.role}
          disabled={isPending}
          onChange={(e) =>
            startTransition(() => updateUserRole(user.id, e.target.value as UserRole))
          }
          className="rounded-md border border-[#c4c6ce] bg-white px-2 py-1 text-xs text-[#181c1e] disabled:opacity-50"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
            user.status === "active"
              ? "bg-[#e6faf3] text-[#007146]"
              : "bg-[#ffdad6] text-[#93000a]"
          }`}
        >
          {user.status === "active" ? "Faol" : "Bloklangan"}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(() =>
              toggleUserStatus(user.id, user.status === "active" ? "blocked" : "active")
            )
          }
          className="text-xs font-semibold text-[#0a2540] hover:underline disabled:opacity-50"
        >
          {user.status === "active" ? "Bloklash" : "Faollashtirish"}
        </button>
      </td>
    </tr>
  );
}
