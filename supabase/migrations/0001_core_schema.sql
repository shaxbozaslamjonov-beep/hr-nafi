-- ============================================================
-- EducaJobs / Nafi HH — Asosiy baza sxemasi (Bosqich 1: Poydevor)
-- profiles, companies, categories, skills + RLS + auto-profile trigger
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. ROLLAR
-- ------------------------------------------------------------
create type public.user_role as enum (
  'student',
  'employer',
  'entrepreneur',
  'educator',
  'admin',
  'superadmin'
);

-- ------------------------------------------------------------
-- 2. PROFILES — har bir auth.users yozuviga 1:1 mos keladi
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'student',
  full_name text,
  phone text,
  city text default 'Samarqand',
  avatar_url text,
  lang text not null default 'uz' check (lang in ('uz', 'ru')),
  tier text not null default 'basic',
  status text not null default 'active' check (status in ('active', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'auth.users kengaytmasi: rol, tarif, holat va shaxsiy ma''lumotlar.';

-- ------------------------------------------------------------
-- 3. COMPANIES — ish beruvchi profiliga tegishli kompaniya
-- ------------------------------------------------------------
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  logo_url text,
  description text,
  industry text,
  size text,
  city text default 'Samarqand',
  verified boolean not null default false,
  tier text not null default 'starter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index companies_owner_id_idx on public.companies (owner_id);

-- ------------------------------------------------------------
-- 4. CATEGORIES / SKILLS — umumiy lug'atlar (kurs va vakansiyalar uchun)
-- ------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type text not null check (type in ('course', 'vacancy')),
  created_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- ------------------------------------------------------------
-- 5. YANGI FOYDALANUVCHI UCHUN AVTOMATIK PROFIL YARATISH
-- ------------------------------------------------------------
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student'),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 6. updated_at avtomatik yangilanishi
-- ------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_companies_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 7. ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.categories enable row level security;
alter table public.skills enable row level security;

-- Yordamchi: joriy foydalanuvchi admin/superadmin ekanini tekshirish
create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'superadmin')
  );
$$;

-- PROFILES siyosatlari
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- Superadmin/admin foydalanuvchi rolini o'zgartira oladi, oddiy user esa faqat
-- o'z profilini yangilaydi (rol/holatdan tashqari maydonlar) — bu cheklov
-- ilova qatlamida (server action) qo'shimcha tekshiriladi.

-- COMPANIES siyosatlari — vakansiya doskasi uchun ochiq o'qish
create policy "companies_select_all"
  on public.companies for select
  using (true);

create policy "companies_insert_own"
  on public.companies for insert
  with check (auth.uid() = owner_id);

create policy "companies_update_own_or_admin"
  on public.companies for update
  using (auth.uid() = owner_id or public.is_admin());

create policy "companies_delete_own_or_admin"
  on public.companies for delete
  using (auth.uid() = owner_id or public.is_admin());

-- CATEGORIES / SKILLS — hammaga ochiq o'qish, faqat admin yozadi
create policy "categories_select_all"
  on public.categories for select
  using (true);

create policy "categories_write_admin"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "skills_select_all"
  on public.skills for select
  using (true);

create policy "skills_write_admin"
  on public.skills for all
  using (public.is_admin())
  with check (public.is_admin());
