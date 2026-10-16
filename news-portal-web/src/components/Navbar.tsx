import { Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-ink-900 dark:text-white"
        >
          <Newspaper size={20} className="text-brand-600" />
          <span>{t("appName")}</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            to="/"
            className="text-ink-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-500"
          >
            {t("home")}
          </Link>
          <Link
            to="/favorites"
            className="text-ink-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-500"
          >
            {t("favorites")}
          </Link>

          {/* Auth ღილაკები ნაბიჯი 3-ში დაემატება */}
          <Link
            to="/login"
            className="rounded-md bg-brand-600 px-3 py-1.5 font-medium text-white hover:bg-brand-700"
          >
            {t("login")}
          </Link>

          <LanguageSwitcher />
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
