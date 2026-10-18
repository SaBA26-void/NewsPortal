import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyFavorites } from "../api/favoritesApi";
import { ArticleCard } from "../components/ArticleCard";
import { EmptyState } from "../components/EmptyState";
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

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchMyFavorites();
        if (!cancelled) setArticles(data);
      } catch {
        if (!cancelled) setError(t("loadError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, t]);

  if (!isAuthenticated) {
    return (
      <section className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold">{t("favorites")}</h1>
        <p className="mt-2 font-medium">{t("favoritesLoginTitle")}</p>
        <p className="mt-1 text-sm text-ink-500">{t("favoritesLoginHint")}</p>
        <div className="mt-4 flex gap-2">
          <Link
            to="/login"
            className="rounded-md bg-brand-600 px-3 py-1.5 text-white"
          >
            {t("login")}
          </Link>
          <Link
            to="/register"
            className="rounded-md border border-slate-300 px-3 py-1.5 dark:border-slate-600"
          >
            {t("register")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-2xl font-bold tracking-tight">{t("myFavorites")}</h1>

      {loading && <Spinner />}

      {!loading && error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title={t("noFavorites")}
            description={t("noFavoritesHint")}
          />
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
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
