"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthState } from "../actions";

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="card w-full max-w-sm p-8">
        <Link href="/" className="font-heading text-lg font-bold">
          Educa<span className="text-gold">Jobs</span>
        </Link>
        <h1 className="mt-4 text-2xl font-bold">Kirish</h1>
        <p className="mt-1 text-sm text-ink-2">Hisobingizga kiring</p>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
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
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
            />
          </div>

          {state.error && <p className="text-sm text-danger">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="brand-gradient mt-2 rounded-lg px-4 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-2">
          Hisobingiz yo&apos;qmi?{" "}
          <Link href="/register" className="font-medium text-brand hover:underline">
            Ro&apos;yxatdan o&apos;ting
          </Link>
        </p>
      </div>
    </main>
  );
}
