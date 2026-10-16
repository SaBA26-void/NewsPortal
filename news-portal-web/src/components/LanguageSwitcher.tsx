import { useLanguage } from "../context/LanguageContext";
import type { Language } from "../types/language";

const langs: Language[] = ["ka", "en"];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
      {langs.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition ${
            language === lang
              ? "bg-brand-500 text-white"
              : "text-ink-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
