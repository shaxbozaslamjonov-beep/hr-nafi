"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus, EmploymentType } from "@/types/database";

export interface FormState {
  error?: string;
  success?: boolean;
}

// ------------------------------------------------------------
// KOMPANIYA
// ------------------------------------------------------------
export async function createCompany(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const industry = String(formData.get("industry") ?? "").trim();
  const city = String(formData.get("city") ?? "Samarqand").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) {
    return { error: "Kompaniya nomini kiriting" };
  }

  const { error } = await supabase.from("companies").insert({
    owner_id: user.id,
    name,
    industry: industry || null,
    city: city || null,
    description: description || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/employer");
  redirect("/dashboard/employer");
}

// ------------------------------------------------------------
// VAKANSIYA
// ------------------------------------------------------------
export async function createVacancy(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companyId = String(formData.get("company_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const salaryMinRaw = String(formData.get("salary_min") ?? "");
  const salaryMaxRaw = String(formData.get("salary_max") ?? "");
  const employmentType = String(formData.get("employment_type") ?? "full_time") as EmploymentType;
  const city = String(formData.get("city") ?? "Samarqand").trim();
  const skillsRaw = String(formData.get("skills") ?? "");
  const skills = skillsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title || !description || !companyId) {
    return { error: "Sarlavha va tavsifni to'ldiring" };
  }

  const { error } = await supabase.from("vacancies").insert({
    company_id: companyId,
    title,
    description,
    salary_min: salaryMinRaw ? Number(salaryMinRaw) : null,
    salary_max: salaryMaxRaw ? Number(salaryMaxRaw) : null,
    employment_type: employmentType,
    city: city || null,
    skills,
    status: "published",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/employer/vacancies");
  redirect("/dashboard/employer/vacancies");
}

export async function updateVacancyStatus(
  vacancyId: string,
  status: "draft" | "published" | "closed"
) {
  const supabase = await createClient();
  await supabase.from("vacancies").update({ status }).eq("id", vacancyId);
  revalidatePath("/dashboard/employer/vacancies");
}

// ------------------------------------------------------------
// REZYUME
// ------------------------------------------------------------
export async function saveResume(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const resumeId = String(formData.get("resume_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim();
  const salaryExpectRaw = String(formData.get("salary_expect") ?? "");
  const experience = String(formData.get("experience") ?? "").trim();
  const skillsRaw = String(formData.get("skills") ?? "");
  const skills = skillsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const fileUrl = String(formData.get("file_url") ?? "").trim();

  if (!title) {
    return { error: "Rezyume sarlavhasini kiriting" };
  }

  const payload = {
    title,
    position: position || null,
    salary_expect: salaryExpectRaw ? Number(salaryExpectRaw) : null,
    experience: experience || null,
    skills,
    file_url: fileUrl || null,
    status: "published" as const,
  };

  const { error } = resumeId
    ? await supabase.from("resumes").update(payload).eq("id", resumeId).eq("user_id", user.id)
    : await supabase.from("resumes").insert({ ...payload, user_id: user.id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/student");
  redirect("/dashboard/student");
}

// ------------------------------------------------------------
// ARIZA
// ------------------------------------------------------------
export async function applyToVacancy(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const vacancyId = String(formData.get("vacancy_id") ?? "");
  const resumeId = String(formData.get("resume_id") ?? "");
  const coverLetter = String(formData.get("cover_letter") ?? "").trim();

  if (!resumeId) {
    return { error: "Rezyume tanlang" };
  }

  const { error } = await supabase.from("applications").insert({
    vacancy_id: vacancyId,
    resume_id: resumeId,
    user_id: user.id,
    cover_letter: coverLetter || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Siz bu vakansiyaga allaqachon ariza yuborgansiz" };
    }
    return { error: error.message };
  }

  revalidatePath(`/jobs/${vacancyId}`);
  return { success: true };
}

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
  const supabase = await createClient();
  await supabase.from("applications").update({ status }).eq("id", applicationId);
  revalidatePath("/dashboard/employer");
}

// ------------------------------------------------------------
// SAQLANGAN ISHLAR
// ------------------------------------------------------------
export async function toggleSavedVacancy(vacancyId: string, isSaved: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (isSaved) {
    await supabase
      .from("saved_vacancies")
      .delete()
      .eq("user_id", user.id)
      .eq("vacancy_id", vacancyId);
  } else {
    await supabase.from("saved_vacancies").insert({ user_id: user.id, vacancy_id: vacancyId });
  }

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${vacancyId}`);
  revalidatePath("/dashboard/student/saved");
}

// ------------------------------------------------------------
// KOMPANIYA JAMOASI
// ------------------------------------------------------------
export async function addCompanyMember(
  companyId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const phone = String(formData.get("phone") ?? "").trim();
  if (!phone) {
    return { error: "Telefon raqamini kiriting" };
  }

  const { data: found, error: rpcError } = await supabase.rpc("find_profile_by_phone", {
    target_phone: phone,
  });

  if (rpcError || !found || found.length === 0) {
    return { error: "Bu telefon raqami bilan foydalanuvchi topilmadi" };
  }

  const { error } = await supabase
    .from("company_members")
    .insert({ company_id: companyId, user_id: found[0].id, role: "member" });

  if (error) {
    if (error.code === "23505") {
      return { error: "Bu foydalanuvchi allaqachon jamoada" };
    }
    return { error: error.message };
  }

  revalidatePath("/dashboard/employer/team");
  return { success: true };
}

export async function removeCompanyMember(memberId: string) {
  const supabase = await createClient();
  await supabase.from("company_members").delete().eq("id", memberId);
  revalidatePath("/dashboard/employer/team");
}
