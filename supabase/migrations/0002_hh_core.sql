-- ============================================================
-- HH-yadro (Bosqich 3): vakansiya, rezyume, ariza
-- ============================================================

-- ------------------------------------------------------------
-- 1. VACANCIES — ish beruvchi joylagan vakansiyalar
-- ------------------------------------------------------------
create table public.vacancies (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  title text not null,
  description text not null,
  salary_min integer,
  salary_max integer,
  employment_type text not null default 'full_time'
    check (employment_type in ('full_time', 'part_time', 'remote', 'internship', 'project')),
  city text default 'Samarqand',
  skills text[] not null default '{}',
  status text not null default 'published' check (status in ('draft', 'published', 'closed')),
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vacancies_company_id_idx on public.vacancies (company_id);
create index vacancies_status_idx on public.vacancies (status);
create index vacancies_skills_idx on public.vacancies using gin (skills);

-- ------------------------------------------------------------
-- 2. RESUMES — talaba/ish izlovchi rezyumelari
-- ------------------------------------------------------------
create table public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  position text,
  salary_expect integer,
  experience text,
  skills text[] not null default '{}',
  file_url text,
  video_url text,
  status text not null default 'published' check (status in ('draft', 'published')),
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index resumes_user_id_idx on public.resumes (user_id);
create index resumes_status_idx on public.resumes (status);
create index resumes_skills_idx on public.resumes using gin (skills);

-- ------------------------------------------------------------
-- 3. APPLICATIONS — vakansiyaga ariza
-- ------------------------------------------------------------
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  vacancy_id uuid not null references public.vacancies (id) on delete cascade,
  resume_id uuid not null references public.resumes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'viewed', 'invited', 'rejected', 'accepted')),
  cover_letter text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vacancy_id, resume_id)
);

create index applications_vacancy_id_idx on public.applications (vacancy_id);
create index applications_user_id_idx on public.applications (user_id);

-- updated_at triggerlari
create trigger set_vacancies_updated_at
  before update on public.vacancies
  for each row execute function public.set_updated_at();

create trigger set_resumes_updated_at
  before update on public.resumes
  for each row execute function public.set_updated_at();

create trigger set_applications_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.vacancies enable row level security;
alter table public.resumes enable row level security;
alter table public.applications enable row level security;

-- Yordamchi: joriy foydalanuvchi shu kompaniya egasimi?
create function public.owns_company(target_company_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.companies
    where id = target_company_id and owner_id = auth.uid()
  );
$$;

-- VACANCIES siyosatlari
create policy "vacancies_select_published_or_owner_or_admin"
  on public.vacancies for select
  using (
    status = 'published'
    or public.owns_company(company_id)
    or public.is_admin()
  );

create policy "vacancies_insert_owner"
  on public.vacancies for insert
  with check (public.owns_company(company_id));

create policy "vacancies_update_owner_or_admin"
  on public.vacancies for update
  using (public.owns_company(company_id) or public.is_admin());

create policy "vacancies_delete_owner_or_admin"
  on public.vacancies for delete
  using (public.owns_company(company_id) or public.is_admin());

-- RESUMES siyosatlari
create policy "resumes_select_published_or_owner_or_admin"
  on public.resumes for select
  using (status = 'published' or auth.uid() = user_id or public.is_admin());

create policy "resumes_insert_own"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "resumes_update_own_or_admin"
  on public.resumes for update
  using (auth.uid() = user_id or public.is_admin());

create policy "resumes_delete_own_or_admin"
  on public.resumes for delete
  using (auth.uid() = user_id or public.is_admin());

-- APPLICATIONS siyosatlari
create policy "applications_select_applicant_or_employer_or_admin"
  on public.applications for select
  using (
    auth.uid() = user_id
    or public.is_admin()
    or exists (
      select 1 from public.vacancies v
      where v.id = vacancy_id and public.owns_company(v.company_id)
    )
  );

create policy "applications_insert_own"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "applications_update_applicant_or_employer_or_admin"
  on public.applications for update
  using (
    auth.uid() = user_id
    or public.is_admin()
    or exists (
      select 1 from public.vacancies v
      where v.id = vacancy_id and public.owns_company(v.company_id)
    )
  );

create policy "applications_delete_own_or_admin"
  on public.applications for delete
  using (auth.uid() = user_id or public.is_admin());
