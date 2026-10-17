import { Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar() {
  const { t } = useLanguage();
  const { isAuthenticated, user, logout, canManageArticles } = useAuth();

  const linkClass =
    "text-ink-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-500";

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-ink-900 dark:text-white"
        >
          <Newspaper size={20} className="text-brand-600" />
          <span>{t("appName")}</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link to="/" className={linkClass}>
            {t("home")}
          </Link>
          <Link to="/favorites" className={linkClass}>
            {t("favorites")}
          </Link>

          {canManageArticles && (
            <Link to="/manage/articles" className={linkClass}>
              {t("manageArticles")}
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <span className="hidden text-ink-500 sm:inline dark:text-slate-400">
                {user?.firstName} ({user?.role})
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-ink-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                {t("login")}
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-brand-600 px-3 py-1.5 font-medium text-white hover:bg-brand-700"
              >
                {t("register")}
              </Link>
            </>
          )}

          <LanguageSwitcher />
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
