import { useLanguage } from "../context/LanguageContext";

export function HomePage() {
  const { t } = useLanguage();

  return (
    <section>
      <h1 className="text-2xl font-bold tracking-tight">{t("welcome")}</h1>
      <p className="mt-2 text-ink-500 dark:text-slate-400">News Portal</p>
    </section>
  );
}
