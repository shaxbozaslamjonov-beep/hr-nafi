import { siteConfig } from "@/lib/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  const brandName = siteConfig.name.replace("Jobs", "");

  return (
    <footer className="mt-auto border-t border-line py-8">
      <div className="container-page flex flex-col items-center justify-between gap-4 text-sm text-ink-2 sm:flex-row">
        <span className="font-heading font-semibold text-ink">
          {brandName}
          <span className="text-gold">Jobs</span>
        </span>
        <span>
          © {new Date().getFullYear()} {siteConfig.name}. {dict.footer.rights}
        </span>
      </div>
    </footer>
  );
}
