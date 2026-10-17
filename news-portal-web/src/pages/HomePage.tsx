import { useEffect, useState } from "react";
import { fetchArticles } from "../api/articlesApi";
import { fetchCategories } from "../api/categoriesApi";
import { ArticleCard } from "../components/ArticleCard";
import { EmptyState } from "../components/EmptyState";
import { Pagination } from "../components/Pagination";
import { Spinner } from "../components/Spinner";
import { useLanguage } from "../context/LanguageContext";
import type { Article } from "../types/article";
import type { Category } from "../types/category";

const PAGE_SIZE = 6;

export function HomePage() {
  const { t, language } = useLanguage();

  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {
        /* categories are optional for listing */
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchArticles({
          page,
          pageSize: PAGE_SIZE,
          categoryId,
        });
        if (cancelled) return;
        setArticles(data.items);
        setTotalPages(data.totalPages || 1);
      } catch {
        if (!cancelled) {
          setError(t("loadError"));
          setArticles([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [page, categoryId, t]);

  const onCategoryChange = (value: string) => {
    setPage(1);
    setCategoryId(value ? Number(value) : null);
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("articles")}</h1>
          <p className="mt-1 text-ink-500 dark:text-slate-400">
            {t("welcome")}
          </p>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block text-ink-500">{t("allCategories")}</span>
          <select
            value={categoryId ?? ""}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="min-w-[200px] rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">{t("allCategories")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {language === "ka" ? c.nameKa : c.nameEn}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <Spinner />}

      {!loading && error && (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title={t("noArticles")}
            description={t("noArticlesHint")}
          />
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <>
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

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
            prevLabel={t("prevPage")}
            nextLabel={t("nextPage")}
          />
        </>
      )}
    </section>
  );
}
