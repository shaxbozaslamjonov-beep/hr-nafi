export interface Dictionary {
  common: {
    help: string;
    login: string;
    register: string;
    city: string;
    download: string;
  };
  tabs: {
    seeker: string;
    employer: string;
  };
  header: {
    resumeCta: string;
    vacancyCta: string;
  };
  hero: {
    seeker: { title: string; subtitle: string; placeholder: string; cta: string };
    employer: { title: string; subtitle: string; placeholder: string; cta: string };
  };
  stats: {
    seeker: { resumes: string; vacancies: string; companies: string };
    employer: { candidates: string; partners: string; companies: string };
  };
  modules: {
    title: string;
    learning: { title: string; desc: string };
    jobs: { title: string; desc: string };
    internship: { title: string; desc: string };
    entrepreneur: { title: string; desc: string };
  };
  footer: {
    rights: string;
  };
}
