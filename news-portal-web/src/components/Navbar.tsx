import { Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar() {
  const { t } = useLanguage();
  const { isAuthenticated, user, logout, canManageArticles } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Newspaper size={20} className="text-brand-600" />
          {t("appName")}
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link to="/">{t("home")}</Link>
          <Link to="/favorites">{t("favorites")}</Link>

          {canManageArticles && (
            <Link to="/manage/articles">{t("manageArticles")}</Link>
          )}

          {isAuthenticated ? (
            <>
              <span className="text-ink-500">
                {user?.firstName} ({user?.role})
              </span>
              <button type="button" onClick={logout}>
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login">{t("login")}</Link>
              <Link
                to="/register"
                className="rounded-md bg-brand-600 px-3 py-1.5 text-white"
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
