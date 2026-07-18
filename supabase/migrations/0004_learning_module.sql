-- ============================================================
-- O'QUV MODULI (Bosqich 2): kurslar, darslar, imtihon, sertifikat
-- ============================================================

-- ------------------------------------------------------------
-- 1. COURSES — kurslar
-- ------------------------------------------------------------
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  title text not null,
  level text not null default 'Level 1',
  hours integer not null default 0,
  description text,
  price numeric(10, 2) not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index courses_created_by_idx on public.courses (created_by);
create index courses_status_idx on public.courses (status);

-- ------------------------------------------------------------
-- 2. LESSONS — kurs darslari
-- ------------------------------------------------------------
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  order_index integer not null default 0,
  title text not null,
  content text,
  video_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lessons_course_id_idx on public.lessons (course_id);

-- ------------------------------------------------------------
-- 3. ENROLLMENTS — kursga yozilish va progress
-- ------------------------------------------------------------
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  progress integer not null default 0 check (progress between 0 and 100),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create index enrollments_user_id_idx on public.enrollments (user_id);
create index enrollments_course_id_idx on public.enrollments (course_id);

-- ------------------------------------------------------------
-- 4. QUIZZES — kurs imtihon savollari
-- questions: [{ "q": "...", "options": ["...","..."], "answer_index": 0 }, ...]
-- ------------------------------------------------------------
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null unique references public.courses (id) on delete cascade,
  questions jsonb not null default '[]'::jsonb,
  passing_score integer not null default 70,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 5. EXAM_RESULTS — imtihon natijalari
-- ------------------------------------------------------------
create table public.exam_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  score integer not null,
  passed boolean not null,
  taken_at timestamptz not null default now()
);

create index exam_results_user_id_idx on public.exam_results (user_id);
create index exam_results_course_id_idx on public.exam_results (course_id);

-- ------------------------------------------------------------
-- 6. CERTIFICATES — sertifikatlar
-- ------------------------------------------------------------
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  cert_number text not null unique,
  issued_at timestamptz not null default now(),
  pdf_url text,
  badge text
);

create index certificates_user_id_idx on public.certificates (user_id);

-- updated_at triggerlari
create trigger set_courses_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

create trigger set_lessons_updated_at
  before update on public.lessons
  for each row execute function public.set_updated_at();

create trigger set_quizzes_updated_at
  before update on public.quizzes
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 7. ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.quizzes enable row level security;
alter table public.exam_results enable row level security;
alter table public.certificates enable row level security;

-- Yordamchi: joriy foydalanuvchi shu kursning muallifimi?
create function public.owns_course(target_course_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.courses
    where id = target_course_id and created_by = auth.uid()
  );
$$;

-- Yordamchi: joriy foydalanuvchi shu kursga yozilganmi?
create function public.is_enrolled(target_course_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.enrollments
    where course_id = target_course_id and user_id = auth.uid()
  );
$$;

-- COURSES siyosatlari
create policy "courses_select_published_or_owner_or_admin"
  on public.courses for select
  using (status = 'published' or created_by = auth.uid() or public.is_admin());

create policy "courses_insert_educator_self"
  on public.courses for insert
  with check (created_by = auth.uid());

create policy "courses_update_owner_or_admin"
  on public.courses for update
  using (created_by = auth.uid() or public.is_admin());

create policy "courses_delete_owner_or_admin"
  on public.courses for delete
  using (created_by = auth.uid() or public.is_admin());

-- LESSONS siyosatlari — faqat kursga yozilgan, kurs egasi yoki admin ko'ra oladi
create policy "lessons_select_enrolled_or_owner_or_admin"
  on public.lessons for select
  using (
    public.owns_course(course_id)
    or public.is_admin()
    or public.is_enrolled(course_id)
  );

create policy "lessons_write_owner_or_admin"
  on public.lessons for all
  using (public.owns_course(course_id) or public.is_admin())
  with check (public.owns_course(course_id) or public.is_admin());

-- ENROLLMENTS siyosatlari
create policy "enrollments_select_own_or_course_owner_or_admin"
  on public.enrollments for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or public.owns_course(course_id)
  );

create policy "enrollments_insert_own"
  on public.enrollments for insert
  with check (user_id = auth.uid());

create policy "enrollments_update_own_or_admin"
  on public.enrollments for update
  using (user_id = auth.uid() or public.is_admin());

-- QUIZZES siyosatlari — faqat yozilgan/egasi/admin o'qiy oladi
-- (savol-javob kaliti mijozga hech qachon to'g'ridan-to'g'ri jo'natilmaydi,
-- tekshirish server action orqali amalga oshiriladi)
create policy "quizzes_select_enrolled_or_owner_or_admin"
  on public.quizzes for select
  using (
    public.owns_course(course_id)
    or public.is_admin()
    or public.is_enrolled(course_id)
  );

create policy "quizzes_write_owner_or_admin"
  on public.quizzes for all
  using (public.owns_course(course_id) or public.is_admin())
  with check (public.owns_course(course_id) or public.is_admin());

-- EXAM_RESULTS siyosatlari
create policy "exam_results_select_own_or_course_owner_or_admin"
  on public.exam_results for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or public.owns_course(course_id)
  );

create policy "exam_results_insert_own"
  on public.exam_results for insert
  with check (user_id = auth.uid());

-- CERTIFICATES siyosatlari — ochiq tekshirish (LinkedIn kabi) + o'z sertifikatlari
create policy "certificates_select_all"
  on public.certificates for select
  using (true);

create policy "certificates_insert_own"
  on public.certificates for insert
  with check (user_id = auth.uid());
