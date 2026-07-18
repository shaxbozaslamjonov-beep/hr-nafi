"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/app/dashboard/notification-actions";
import type { Notification } from "@/types/database";

export function NotificationBell({ notifications }: { notifications: Notification[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg border border-line p-2 hover:bg-card"
        aria-label="Bildirishnomalar"
      >
        <span aria-hidden>🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-line bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-sm font-semibold">Bildirishnomalar</span>
            {unreadCount > 0 && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => startTransition(() => markAllNotificationsRead())}
                className="text-xs text-brand hover:underline disabled:opacity-50"
              >
                Hammasini o&apos;qish
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-ink-3">Bildirishnoma yo&apos;q.</p>
            )}
            {notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link ?? "#"}
                onClick={() => {
                  setOpen(false);
                  if (!n.read) startTransition(() => markNotificationRead(n.id));
                }}
                className={`block border-b border-line px-4 py-3 text-sm last:border-0 hover:bg-card-2 ${
                  n.read ? "text-ink-2" : "text-ink"
                }`}
              >
                <div className="flex items-center gap-2 font-medium">
                  {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
                  {n.title}
                </div>
                {n.body && <p className="mt-0.5 text-xs text-ink-2">{n.body}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
