// Qo'lda yozilgan tiplar — supabase/migrations/0001_core_schema.sql bilan mos.
// Supabase loyihasi ulangach `npx supabase gen types typescript` bilan
// avtomatik generatsiya qilingan fayl bilan almashtirish mumkin.
//
// MUHIM: bu yerda `interface` emas, `type` ishlatiladi — TypeScript'da
// interfeys shartli tiplarda (`T extends Record<string, unknown>`) mos
// kelmaydi, buni @supabase/postgrest-js Row/Insert/Update ni aniqlashda
// ichki `extends GenericSchema` tekshiruvida ishlatadi.

export type UserRole =
  | "student"
  | "employer"
  | "entrepreneur"
  | "educator"
  | "admin"
  | "superadmin";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  avatar_url: string | null;
  lang: "uz" | "ru";
  tier: string;
  status: "active" | "blocked";
  created_at: string;
  updated_at: string;
};

export type Company = {
  id: string;
  owner_id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  industry: string | null;
  size: string | null;
  city: string | null;
  verified: boolean;
  tier: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  type: "course" | "vacancy";
  created_at: string;
};

export type Skill = {
  id: string;
  name: string;
};

export type EmploymentType = "full_time" | "part_time" | "remote" | "internship" | "project";

export type Vacancy = {
  id: string;
  company_id: string;
  category_id: string | null;
  title: string;
  description: string;
  salary_min: number | null;
  salary_max: number | null;
  employment_type: EmploymentType;
  city: string | null;
  skills: string[];
  status: "draft" | "published" | "closed";
  views: number;
  created_at: string;
  updated_at: string;
};

export type Resume = {
  id: string;
  user_id: string;
  title: string;
  position: string | null;
  salary_expect: number | null;
  experience: string | null;
  skills: string[];
  file_url: string | null;
  video_url: string | null;
  status: "draft" | "published";
  views: number;
  created_at: string;
  updated_at: string;
};

export type ApplicationStatus = "pending" | "viewed" | "invited" | "rejected" | "accepted";

export type Application = {
  id: string;
  vacancy_id: string;
  resume_id: string;
  user_id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
};

export type Course = {
  id: string;
  created_by: string;
  category_id: string | null;
  title: string;
  level: string;
  hours: number;
  description: string | null;
  price: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export type Lesson = {
  id: string;
  course_id: string;
  order_index: number;
  title: string;
  content: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Enrollment = {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  completed_at: string | null;
  created_at: string;
};

export type QuizQuestion = {
  q: string;
  options: string[];
  answer_index: number;
};

export type Quiz = {
  id: string;
  course_id: string;
  questions: QuizQuestion[];
  passing_score: number;
  created_at: string;
  updated_at: string;
};

export type ExamResult = {
  id: string;
  user_id: string;
  course_id: string;
  score: number;
  passed: boolean;
  taken_at: string;
};

export type Certificate = {
  id: string;
  user_id: string;
  course_id: string;
  cert_number: string;
  issued_at: string;
  pdf_url: string | null;
  badge: string | null;
};

export type SavedVacancy = {
  id: string;
  user_id: string;
  vacancy_id: string;
  created_at: string;
};

export type NotificationType =
  | "new_application"
  | "application_status"
  | "certificate_issued";

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

export type CompanyMember = {
  id: string;
  company_id: string;
  user_id: string;
  role: "owner" | "member";
  created_at: string;
};

export type Plan = {
  id: string;
  code: string;
  name: string;
  target_role: "student" | "employer" | "entrepreneur";
  price: number;
  billing_period: "one_time" | "monthly";
  features: string[];
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan_id: string;
  status: "pending" | "active" | "expired" | "cancelled";
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      companies: {
        Row: Company;
        Insert: Partial<Company> & { owner_id: string; name: string };
        Update: Partial<Company>;
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: Partial<Category> & { name: string; slug: string; type: Category["type"] };
        Update: Partial<Category>;
        Relationships: [];
      };
      skills: {
        Row: Skill;
        Insert: Partial<Skill> & { name: string };
        Update: Partial<Skill>;
        Relationships: [];
      };
      vacancies: {
        Row: Vacancy;
        Insert: Partial<Vacancy> & { company_id: string; title: string; description: string };
        Update: Partial<Vacancy>;
        Relationships: [];
      };
      resumes: {
        Row: Resume;
        Insert: Partial<Resume> & { user_id: string; title: string };
        Update: Partial<Resume>;
        Relationships: [];
      };
      applications: {
        Row: Application;
        Insert: Partial<Application> & { vacancy_id: string; resume_id: string; user_id: string };
        Update: Partial<Application>;
        Relationships: [];
      };
      courses: {
        Row: Course;
        Insert: Partial<Course> & { created_by: string; title: string };
        Update: Partial<Course>;
        Relationships: [];
      };
      lessons: {
        Row: Lesson;
        Insert: Partial<Lesson> & { course_id: string; title: string };
        Update: Partial<Lesson>;
        Relationships: [];
      };
      enrollments: {
        Row: Enrollment;
        Insert: Partial<Enrollment> & { user_id: string; course_id: string };
        Update: Partial<Enrollment>;
        Relationships: [];
      };
      quizzes: {
        Row: Quiz;
        Insert: Partial<Quiz> & { course_id: string };
        Update: Partial<Quiz>;
        Relationships: [];
      };
      exam_results: {
        Row: ExamResult;
        Insert: Partial<ExamResult> & { user_id: string; course_id: string; score: number; passed: boolean };
        Update: Partial<ExamResult>;
        Relationships: [];
      };
      certificates: {
        Row: Certificate;
        Insert: Partial<Certificate> & { user_id: string; course_id: string; cert_number: string };
        Update: Partial<Certificate>;
        Relationships: [];
      };
      saved_vacancies: {
        Row: SavedVacancy;
        Insert: Partial<SavedVacancy> & { user_id: string; vacancy_id: string };
        Update: Partial<SavedVacancy>;
        Relationships: [];
      };
      notifications: {
        Row: Notification;
        Insert: Partial<Notification> & { user_id: string; type: NotificationType; title: string };
        Update: Partial<Notification>;
        Relationships: [];
      };
      company_members: {
        Row: CompanyMember;
        Insert: Partial<CompanyMember> & { company_id: string; user_id: string };
        Update: Partial<CompanyMember>;
        Relationships: [];
      };
      plans: {
        Row: Plan;
        Insert: Partial<Plan> & { code: string; name: string; target_role: Plan["target_role"]; price: number; billing_period: Plan["billing_period"] };
        Update: Partial<Plan>;
        Relationships: [];
      };
      subscriptions: {
        Row: Subscription;
        Insert: Partial<Subscription> & { user_id: string; plan_id: string };
        Update: Partial<Subscription>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      find_profile_by_phone: {
        Args: { target_phone: string };
        Returns: { id: string; full_name: string | null; phone: string | null }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
