import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEmployerCompany } from "@/lib/company";
import { AddMemberForm } from "@/components/hh/AddMemberForm";
import { MemberRow } from "@/components/hh/MemberRow";

export default async function CompanyTeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const company = await getEmployerCompany(supabase, user.id);

  if (!company) {
    redirect("/dashboard/employer");
  }

  const isOwner = company.owner_id === user.id;

  const { data: members } = await supabase
    .from("company_members")
    .select("*")
    .eq("company_id", company.id)
    .order("created_at", { ascending: true });

  const userIds = [...new Set((members ?? []).map((m) => m.user_id))];
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("*").in("id", userIds)
    : { data: [] };
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", company.owner_id)
    .single();

  return (
    <main className="container-page py-10">
      <h1 className="text-2xl font-bold">{company.name} — Jamoa</h1>
      <p className="mt-1 text-sm text-ink-2">
        Xodimlaringiz shu kompaniya nomidan vakansiya joylashtira oladi.
      </p>

      {isOwner && (
        <div className="mt-6">
          <AddMemberForm companyId={company.id} />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <div className="card flex items-center justify-between gap-4 p-4">
          <div>
            <p className="font-medium">{ownerProfile?.full_name ?? "Egasi"}</p>
            <p className="text-sm text-ink-2">{ownerProfile?.phone}</p>
          </div>
          <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs text-brand">Egasi</span>
        </div>

        {(members ?? []).map((m) => (
          <MemberRow
            key={m.id}
            member={m}
            profile={profileMap.get(m.user_id)}
            canManage={isOwner}
          />
        ))}
      </div>
    </main>
  );
}
