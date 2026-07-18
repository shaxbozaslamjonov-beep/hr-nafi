// Oddiy "aqlli moslashtirish" evristikasi: rezyume va vakansiya
// ko'nikmalari orasidagi kesishishga asoslangan moslik foizi.
// Haqiqiy semantik AI emas, lekin foydali va tushunarli signal beradi.
export function computeMatchScore(resumeSkills: string[], vacancySkills: string[]): number {
  if (vacancySkills.length === 0) return 0;

  const normalize = (s: string) => s.trim().toLowerCase();
  const resumeSet = new Set(resumeSkills.map(normalize));
  const vacancySet = new Set(vacancySkills.map(normalize));

  let matched = 0;
  for (const skill of vacancySet) {
    if (resumeSet.has(skill)) matched += 1;
  }

  return Math.round((matched / vacancySet.size) * 100);
}
