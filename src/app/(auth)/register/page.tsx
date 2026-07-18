"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { register, type AuthState } from "../actions";

const initialState: AuthState = {};

const roles = [
  { value: "student", label: "Talaba" },
  { value: "employer", label: "Ish beruvchi" },
  { value: "entrepreneur", label: "Tadbirkor" },
];

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, initialState);
  const [role, setRole] = useState("student");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="card w-full max-w-md p-8">
        <Link href="/" className="font-heading text-lg font-bold">
          Educa<span className="text-gold">Jobs</span>
        </Link>
        <h1 className="mt-4 text-2xl font-bold">Ro&apos;yxatdan o&apos;tish</h1>
        <p className="mt-1 text-sm text-ink-2">Hisobingizni yarating</p>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div>
            <span className="mb-1 block text-sm text-ink-2">Kim sifatida?</span>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                    role === r.value
                      ? "border-brand bg-brand/10 text-ink"
                      : "border-line text-ink-2 hover:text-ink"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <input type="hidden" name="role" value={role} />
          </div>

          <div>
            <label className="mb-1 block text-sm text-ink-2" htmlFor="full_name">
              To&apos;liq ism
            </label>
            <input
              id="full_name"
              name="full_name"
              autoComplete="name"
              required
              className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-2" htmlFor="phone">
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+998 90 123-45-67"
              className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-2" htmlFor="password">
              Parol
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
            />
          </div>

          {state.error && <p className="text-sm text-danger">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="brand-gradient mt-2 rounded-lg px-4 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-2">
          Hisobingiz bormi?{" "}
          <Link href="/login" className="font-medium text-brand hover:underline">
            Kiring
          </Link>
        </p>
      </div>
    </main>
  );
}
