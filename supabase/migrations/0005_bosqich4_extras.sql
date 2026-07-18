-- ============================================================
-- BOSQICH 4: Bildirishnomalar, Saqlangan ishlar, Kompaniya jamoasi,
-- Tarif rejalari/obuna, Rezyume fayl saqlash (Storage)
-- ============================================================

-- ------------------------------------------------------------
-- 1. SAQLANGAN ISHLAR (sevimlilar)
-- ------------------------------------------------------------
create table public.saved_vacancies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  vacancy_id uuid not null references public.vacancies (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, vacancy_id)
);

alter table public.saved_vacancies enable row level security;

create policy "saved_vacancies_select_own"
  on public.saved_vacancies for select
  using (user_id = auth.uid());

create policy "saved_vacancies_insert_own"
  on public.saved_vacancies for insert
  with check (user_id = auth.uid());

create policy "saved_vacancies_delete_own"
  on public.saved_vacancies for delete
  using (user_id = auth.uid());

-- ------------------------------------------------------------
-- 2. BILDIRISHNOMALAR
-- ------------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications (user_id);

alter table public.notifications enable row level security;

create policy "notifications_select_own"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "notifications_update_own"
  on public.notifications for update
  using (user_id = auth.uid());

-- Bildirishnomalar faqat trigger orqali (security definer, jadval egasi
-- sifatida RLS'ni chetlab o'tadi) yaratiladi — mijoz to'g'ridan-to'g'ri
-- boshqa foydalanuvchiga bildirishnoma yoza olmaydi.

create function public.notify_new_application()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_title text;
  v_owner uuid;
begin
  select v.title, c.owner_id into v_title, v_owner
  from public.vacancies v
  join public.companies c on c.id = v.company_id
  where v.id = new.vacancy_id;

  insert into public.notifications (user_id, type, title, body, link)
  values (
    v_owner,
    'new_application',
    'Yangi ariza',
    v_title,
    '/dashboard/employer/vacancies/' || new.vacancy_id || '/applications'
  );

  return new;
end;
$$;

create trigger on_application_created
  after insert on public.applications
  for each row execute function public.notify_new_application();

create function public.notify_application_status_changed()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_title text;
begin
  if new.status is distinct from old.status then
    select title into v_title from public.vacancies where id = new.vacancy_id;

    insert into public.notifications (user_id, type, title, body, link)
    values (
      new.user_id,
      'application_status',
      'Ariza holati yangilandi',
      v_title || ': ' || new.status,
      '/dashboard/student/applications'
    );
  end if;

  return new;
end;
$$;

create trigger on_application_status_changed
  after update on public.applications
  for each row execute function public.notify_application_status_changed();

create function public.notify_certificate_issued()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_title text;
begin
  select title into v_title from public.courses where id = new.course_id;

  insert into public.notifications (user_id, type, title, body, link)
  values (
    new.user_id,
    'certificate_issued',
    'Sertifikat tayyor!',
    v_title,
    '/dashboard/student/certificates'
  );

  return new;
end;
$$;

create trigger on_certificate_issued
  after insert on public.certificates
  for each row execute function public.notify_certificate_issued();

-- ------------------------------------------------------------
-- 3. KOMPANIYA JAMOASI (xodimlar)
-- ------------------------------------------------------------
create table public.company_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (company_id, user_id)
);

alter table public.company_members enable row level security;

-- owns_company endi companies.owner_id VA company_members ikkalasini ham tekshiradi
create or replace function public.owns_company(target_company_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.companies
    where id = target_company_id and owner_id = auth.uid()
  ) or exists (
    select 1 from public.company_members
    where company_id = target_company_id and user_id = auth.uid()
  );
$$;

create function public.is_company_owner(target_company_id uuid)
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

create policy "company_members_select"
  on public.company_members for select
  using (public.owns_company(company_id));

create policy "company_members_insert_owner"
  on public.company_members for insert
  with check (public.is_company_owner(company_id));

create policy "company_members_delete_owner"
  on public.company_members for delete
  using (public.is_company_owner(company_id));

-- Xodim qo'shish uchun: telefon raqami bo'yicha profil qidirish
-- (RLS'ni to'liq ochmasdan, faqat id+ism+telefonni qaytaradi)
create function public.find_profile_by_phone(target_phone text)
returns table (id uuid, full_name text, phone text)
language sql
security definer set search_path = public
stable
as $$
  select id, full_name, phone
  from public.profiles
  where phone = target_phone
  limit 1;
$$;

-- ------------------------------------------------------------
-- 4. TARIF REJALARI VA OBUNA
-- ------------------------------------------------------------
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  target_role text not null check (target_role in ('student', 'employer', 'entrepreneur')),
  price numeric(10, 2) not null,
  billing_period text not null check (billing_period in ('one_time', 'monthly')),
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan_id uuid not null references public.plans (id),
  status text not null default 'pending' check (status in ('pending', 'active', 'expired', 'cancelled')),
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions (user_id);

alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;

create policy "plans_select_all"
  on public.plans for select
  using (true);

create policy "plans_write_admin"
  on public.plans for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "subscriptions_select_own_or_admin"
  on public.subscriptions for select
  using (user_id = auth.uid() or public.is_admin());

create policy "subscriptions_insert_own"
  on public.subscriptions for insert
  with check (user_id = auth.uid());

create policy "subscriptions_update_own_or_admin"
  on public.subscriptions for update
  using (user_id = auth.uid() or public.is_admin());

-- ------------------------------------------------------------
-- 5. REZYUME FAYL SAQLASH (Supabase Storage)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

create policy "resumes_storage_select_all"
  on storage.objects for select
  using (bucket_id = 'resumes');

create policy "resumes_storage_insert_own"
  on storage.objects for insert
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "resumes_storage_update_own"
  on storage.objects for update
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "resumes_storage_delete_own"
  on storage.objects for delete
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);
