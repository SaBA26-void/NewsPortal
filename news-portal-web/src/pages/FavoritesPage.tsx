import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyFavorites } from "../api/favoritesApi";
import { ArticleCard } from "../components/ArticleCard";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import type { Article } from "../types/article";

export function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    const load = async () => {
      try {
        setLoading(true);
        setArticles(await fetchMyFavorites());
      } catch {
        setError(t("error"));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [isAuthenticated, t]);

  if (!isAuthenticated) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold">{t("favorites")}</h1>
        <p className="mt-2">{t("needLogin")}</p>
        <div className="mt-4 flex gap-3">
          <Link to="/login" className="text-brand-600">
            {t("login")}
          </Link>
          <Link to="/register" className="text-brand-600">
            {t("register")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-2xl font-bold">{t("myFavorites")}</h1>
      {loading && <Spinner />}
      {!loading && error && <p className="mt-4 text-red-600">{error}</p>}
      {!loading && !error && articles.length === 0 && (
        <p className="mt-4 text-ink-500">{t("noFavorites")}</p>
      )}
      {!loading && articles.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              language={language}
              readMoreLabel={t("readMore")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
