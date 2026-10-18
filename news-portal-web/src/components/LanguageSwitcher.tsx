import { useLanguage, type Language } from "../context/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
      {(["ka", "en"] as Language[]).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={`rounded-md px-2 py-1 text-xs font-semibold uppercase ${
            language === lang
              ? "bg-brand-500 text-white"
              : "text-ink-500"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
