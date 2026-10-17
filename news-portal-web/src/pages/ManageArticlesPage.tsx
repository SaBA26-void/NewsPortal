import { useLanguage } from "../context/LanguageContext";

export function ManageArticlesPage() {
  const { t } = useLanguage();

  return (
    <section>
      <h1 className="text-2xl font-bold tracking-tight">
        {t("manageArticles")}
      </h1>
      <p className="mt-2 text-ink-500 dark:text-slate-400">
        Placeholder — step 6
      </p>
    </section>
  );
}
