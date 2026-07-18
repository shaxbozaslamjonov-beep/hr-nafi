-- Ish beruvchi o'z vakansiyasiga ariza bergan nomzodning profilini
-- (ism, telefon) ko'ra olishi kerak — aks holda arizalar ro'yxatida
-- "Noma'lum" bo'lib chiqadi.

create policy "profiles_select_applicant_by_employer"
  on public.profiles for select
  using (
    exists (
      select 1
      from public.applications a
      join public.vacancies v on v.id = a.vacancy_id
      where a.user_id = profiles.id
        and public.owns_company(v.company_id)
    )
  );
