import { GraduationCap, Briefcase, Users, Rocket } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function ModulesSection({ dict }: { dict: Dictionary }) {
  const items = [
    { icon: GraduationCap, ...dict.modules.learning },
    { icon: Briefcase, ...dict.modules.jobs },
    { icon: Users, ...dict.modules.internship },
    { icon: Rocket, ...dict.modules.entrepreneur },
  ];

  return (
    <section className="container-page py-16">
      <h2 className="text-center text-3xl sm:text-4xl">{dict.modules.title}</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-6">
            <div className="brand-gradient mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-ink-2">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
