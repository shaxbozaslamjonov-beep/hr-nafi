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
    <tr className="border-t border-line">
      <td className="px-4 py-3">{user.full_name ?? "—"}</td>
      <td className="px-4 py-3 text-ink-2">{user.phone ?? "—"}</td>
      <td className="px-4 py-3">
        <select
          defaultValue={user.role}
          disabled={isPending}
          onChange={(e) =>
            startTransition(() => updateUserRole(user.id, e.target.value as UserRole))
          }
          className="rounded-lg border border-line bg-bg-2 px-2 py-1 text-xs disabled:opacity-50"
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
          className={`rounded-full px-2 py-1 text-xs ${
            user.status === "active" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
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
          className="text-xs font-medium text-brand hover:underline disabled:opacity-50"
        >
          {user.status === "active" ? "Bloklash" : "Faollashtirish"}
        </button>
      </td>
    </tr>
  );
}
