-- Boshlang'ich lug'at ma'lumotlari (kategoriyalar va ko'nikmalar).
-- profiles/companies uchun seed yo'q — ular auth.users orqali haqiqiy
-- ro'yxatdan o'tish natijasida (trigger bilan) avtomatik yaratiladi.

insert into public.categories (name, slug, type) values
  ('Frontend', 'frontend', 'course'),
  ('Backend', 'backend', 'course'),
  ('Mobil dasturlash', 'mobile-dev', 'course'),
  ('DevOps va Cloud', 'devops-cloud', 'course'),
  ('Data Science va AI', 'data-ai', 'course'),
  ('Digital Marketing', 'digital-marketing', 'course'),
  ('Loyiha boshqaruvi', 'project-management', 'course'),
  ('UI/UX Dizayn', 'ui-ux-design', 'course'),
  ('Ingliz tili', 'english', 'course'),
  ('IT', 'it', 'vacancy'),
  ('Marketing', 'marketing', 'vacancy'),
  ('Sotuv', 'sales', 'vacancy'),
  ('Dizayn', 'design', 'vacancy'),
  ('Moliya', 'finance', 'vacancy'),
  ('HR', 'hr', 'vacancy')
on conflict (slug) do nothing;

insert into public.skills (name) values
  ('JavaScript'), ('TypeScript'), ('React'), ('Vue'), ('Node.js'),
  ('Python'), ('FastAPI'), ('PostgreSQL'), ('Figma'), ('SEO'),
  ('SMM'), ('Excel'), ('1C'), ('Ingliz tili'), ('Loyiha boshqaruvi')
on conflict (name) do nothing;

-- Tarif rejalari (Bosqich 4)
insert into public.plans (code, name, target_role, price, billing_period, features) values
  ('student_basic', 'Basic', 'student', 0, 'monthly', '["Bepul kurslar", "1 rezyume", "10 ta ariza"]'::jsonb),
  ('student_pro', 'Pro', 'student', 5, 'monthly', '["Barcha kurslar", "5 rezyume", "100 ta ariza", "Analitika"]'::jsonb),
  ('student_master', 'Master', 'student', 15, 'monthly', '["Barcha kurslar", "Cheksiz rezyume", "Cheksiz ariza", "AI Coaching"]'::jsonb),
  ('student_premium', 'Premium', 'student', 30, 'monthly', '["Barcha imkoniyatlar", "1-on-1 Coach", "VIP qo''llab-quvvatlash"]'::jsonb),
  ('employer_starter', 'Starter', 'employer', 200, 'monthly', '["5 vakansiya", "Oddiy skrining", "100 ko''rishlar"]'::jsonb),
  ('employer_growth', 'Growth', 'employer', 500, 'monthly', '["20 vakansiya", "Kengaytirilgan skrining", "500 ko''rishlar", "Brending"]'::jsonb),
  ('employer_business', 'Business', 'employer', 1000, 'monthly', '["Cheksiz vakansiya", "Kengaytirilgan skrining", "Cheksiz ko''rishlar"]'::jsonb),
  ('entrepreneur_standard', 'Standard', 'entrepreneur', 10, 'monthly', '["Barcha xususiyatlar", "Xabar almashish", "Shartnoma boshqaruvi"]'::jsonb),
  ('entrepreneur_premium', 'Premium', 'entrepreneur', 25, 'monthly', '["Ustuvor ro''yxat", "Konsultant", "Tasdiqlangan belgisi"]'::jsonb)
on conflict (code) do nothing;
