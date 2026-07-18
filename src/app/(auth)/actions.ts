"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export interface AuthState {
  error?: string;
}

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email va parolni kiriting" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Login yoki parol noto'g'ri" };
  }

  redirect("/dashboard");
}

const ALLOWED_SIGNUP_ROLES: UserRole[] = ["student", "employer", "entrepreneur"];

export async function register(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const roleInput = String(formData.get("role") ?? "student") as UserRole;
  const role = ALLOWED_SIGNUP_ROLES.includes(roleInput) ? roleInput : "student";

  if (!fullName || !email || !password) {
    return { error: "Barcha majburiy maydonlarni to'ldiring" };
  }
  if (password.length < 6) {
    return { error: "Parol kamida 6 belgidan iborat bo'lishi kerak" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone, role },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
