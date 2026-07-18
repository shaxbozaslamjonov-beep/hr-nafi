import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function StudentCertificatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: certificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  const courseIds = [...new Set((certificates ?? []).map((c) => c.course_id))];
  const { data: courses } = courseIds.length
    ? await supabase.from("courses").select("*").in("id", courseIds)
    : { data: [] };
  const courseMap = new Map((courses ?? []).map((c) => [c.id, c]));

  return (
    <main className="container-page py-10">
      <h1 className="text-2xl font-bold">Sertifikatlarim</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(certificates ?? []).map((cert) => (
          <Link
            key={cert.id}
            href={`/certificates/${cert.cert_number}`}
            className="card block p-5 hover:border-brand"
          >
            <h2 className="font-semibold">{courseMap.get(cert.course_id)?.title ?? "Kurs"}</h2>
            <p className="mt-1 text-xs text-ink-3">{cert.cert_number}</p>
            <p className="mt-2 text-sm text-ink-2">
              {new Date(cert.issued_at).toLocaleDateString("uz-UZ")}
            </p>
          </Link>
        ))}
        {(!certificates || certificates.length === 0) && (
          <p className="col-span-2 py-10 text-center text-ink-3">
            Hali sertifikat qo&apos;lga kiritmagansiz.
          </p>
        )}
      </div>
    </main>
  );
}
