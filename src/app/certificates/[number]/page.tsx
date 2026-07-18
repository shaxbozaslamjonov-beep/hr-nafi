import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function CertificateVerifyPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const supabase = await createClient();

  const { data: cert } = await supabase
    .from("certificates")
    .select("*")
    .eq("cert_number", number)
    .single();

  if (!cert) {
    notFound();
  }

  const [{ data: course }, { data: owner }] = await Promise.all([
    supabase.from("courses").select("*").eq("id", cert.course_id).single(),
    supabase.from("profiles").select("full_name").eq("id", cert.user_id).single(),
  ]);

  return (
    <main className="container-page flex min-h-screen items-center justify-center py-16">
      <div className="card max-w-md p-10 text-center">
        <span className="brand-gradient inline-flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white">
          ✓
        </span>
        <h1 className="mt-6 text-xl font-semibold">Sertifikat tasdiqlandi</h1>
        <p className="mt-4 text-lg font-bold">{owner?.full_name ?? "Foydalanuvchi"}</p>
        <p className="mt-1 text-ink-2">{course?.title}</p>
        <p className="mt-4 text-sm text-ink-3">
          {new Date(cert.issued_at).toLocaleDateString("uz-UZ")}
        </p>
        <p className="mt-6 font-mono text-xs text-ink-3">{cert.cert_number}</p>
      </div>
    </main>
  );
}
