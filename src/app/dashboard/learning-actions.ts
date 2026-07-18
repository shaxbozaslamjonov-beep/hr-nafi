"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { QuizQuestion } from "@/types/database";

export interface FormState {
  error?: string;
  success?: boolean;
}

// ------------------------------------------------------------
// KURS
// ------------------------------------------------------------
export async function createCourse(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const level = String(formData.get("level") ?? "Level 1").trim();
  const hoursRaw = String(formData.get("hours") ?? "0");

  if (!title) {
    return { error: "Kurs nomini kiriting" };
  }

  const { data, error } = await supabase
    .from("courses")
    .insert({
      created_by: user.id,
      title,
      description: description || null,
      level,
      hours: Number(hoursRaw) || 0,
      status: "published",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Xatolik yuz berdi" };
  }

  revalidatePath("/dashboard/educator");
  redirect(`/dashboard/educator/courses/${data.id}`);
}

// ------------------------------------------------------------
// DARS
// ------------------------------------------------------------
export async function createLesson(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const courseId = String(formData.get("course_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const videoUrl = String(formData.get("video_url") ?? "").trim();
  const orderIndexRaw = String(formData.get("order_index") ?? "0");

  if (!title || !courseId) {
    return { error: "Dars nomini kiriting" };
  }

  const { error } = await supabase.from("lessons").insert({
    course_id: courseId,
    title,
    content: content || null,
    video_url: videoUrl || null,
    order_index: Number(orderIndexRaw) || 0,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/educator/courses/${courseId}`);
  redirect(`/dashboard/educator/courses/${courseId}`);
}

// ------------------------------------------------------------
// IMTIHON SAVOLLARI (educator tomonidan)
// ------------------------------------------------------------
export async function saveQuiz(
  courseId: string,
  questions: QuizQuestion[],
  passingScore: number
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("quizzes")
    .upsert({ course_id: courseId, questions, passing_score: passingScore }, { onConflict: "course_id" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/educator/courses/${courseId}/quiz`);
  return { success: true };
}

// ------------------------------------------------------------
// KURSGA YOZILISH
// ------------------------------------------------------------
export async function enrollInCourse(courseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("enrollments").insert({ user_id: user.id, course_id: courseId });
  revalidatePath(`/courses/${courseId}`);
  redirect(`/learn/${courseId}`);
}

export async function markLessonViewed(courseId: string, progress: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("enrollments")
    .update({
      progress,
      completed_at: progress >= 100 ? new Date().toISOString() : null,
    })
    .eq("user_id", user.id)
    .eq("course_id", courseId);

  revalidatePath(`/learn/${courseId}`);
}

// ------------------------------------------------------------
// IMTIHON TOPSHIRISH
// ------------------------------------------------------------
function generateCertNumber(courseId: string) {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `EDU-${courseId.slice(0, 8).toUpperCase()}-${rand}`;
}

export async function submitExam(courseId: string, answers: number[]): Promise<FormState & { score?: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("*")
    .eq("course_id", courseId)
    .single();

  if (!quiz || quiz.questions.length === 0) {
    return { error: "Bu kurs uchun imtihon topilmadi" };
  }

  const total = quiz.questions.length;
  const correct = quiz.questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.answer_index ? 1 : 0),
    0
  );
  const score = Math.round((correct / total) * 100);
  const passed = score >= quiz.passing_score;

  await supabase.from("exam_results").insert({
    user_id: user.id,
    course_id: courseId,
    score,
    passed,
  });

  if (passed) {
    await supabase.from("certificates").insert({
      user_id: user.id,
      course_id: courseId,
      cert_number: generateCertNumber(courseId),
    });
    await supabase
      .from("enrollments")
      .update({ progress: 100, completed_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("course_id", courseId);
  }

  revalidatePath(`/learn/${courseId}`);
  return { success: true, score };
}
