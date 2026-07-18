"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { saveResume, type FormState } from "@/app/dashboard/hh-actions";
import { createClient } from "@/lib/supabase/client";
import type { Resume } from "@/types/database";

const initialState: FormState = {};

export function ResumeForm({ resume }: { resume?: Resume }) {
  const [state, formAction, pending] = useActionState(saveResume, initialState);
  const [fileUrl, setFileUrl] = useState(resume?.file_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploadError("Tizimga kiring");
      setUploading(false);
      return;
    }

    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("resumes").upload(path, file, {
      upsert: true,
    });

    if (error) {
      setUploadError(error.message);
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("resumes").getPublicUrl(path);
    setFileUrl(publicUrl.publicUrl);
    setUploading(false);
  }

  return (
    <div className="card mx-auto max-w-2xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{resume ? "Rezyumeni tahrirlash" : "Yangi rezyume"}</h1>
        {resume && (
          <Link
            href={`/resume/${resume.id}/print`}
            target="_blank"
            className="text-sm text-brand hover:underline"
          >
            PDF ko&apos;rinishida yuklab olish
          </Link>
        )}
      </div>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        {resume && <input type="hidden" name="resume_id" value={resume.id} />}
        <input type="hidden" name="file_url" value={fileUrl} />

        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="title">
            Rezyume sarlavhasi
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={resume?.title}
            placeholder="Masalan: Frontend dasturchi"
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="position">
            Lavozim
          </label>
          <input
            id="position"
            name="position"
            defaultValue={resume?.position ?? ""}
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="salary_expect">
            Kutilayotgan maosh
          </label>
          <input
            id="salary_expect"
            name="salary_expect"
            type="number"
            min={0}
            defaultValue={resume?.salary_expect ?? undefined}
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="experience">
            Tajriba
          </label>
          <textarea
            id="experience"
            name="experience"
            rows={4}
            defaultValue={resume?.experience ?? ""}
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="skills">
            Ko&apos;nikmalar (vergul bilan ajrating)
          </label>
          <input
            id="skills"
            name="skills"
            defaultValue={resume?.skills?.join(", ") ?? ""}
            placeholder="React, TypeScript, Figma"
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-2" htmlFor="resume_file">
            Tayyor rezyume faylini joylash (PDF, ixtiyoriy)
          </label>
          <input
            ref={fileInputRef}
            id="resume_file"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-sm text-ink file:mr-3 file:rounded-lg file:border-0 file:bg-card-2 file:px-3 file:py-1.5 file:text-ink focus:border-brand focus:outline-none"
          />
          {uploading && <p className="mt-1 text-xs text-ink-3">Yuklanmoqda...</p>}
          {uploadError && <p className="mt-1 text-xs text-danger">{uploadError}</p>}
          {fileUrl && !uploading && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-xs text-brand hover:underline"
            >
              Yuklangan faylni ko&apos;rish
            </a>
          )}
        </div>

        {state.error && <p className="text-sm text-danger">{state.error}</p>}

        <button
          type="submit"
          disabled={pending || uploading}
          className="brand-gradient mt-2 rounded-lg px-4 py-2.5 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </div>
  );
}
