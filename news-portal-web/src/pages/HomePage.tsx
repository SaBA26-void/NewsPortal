import { useEffect, useState } from "react";
import { fetchArticles } from "../api/articlesApi";
import { fetchCategories } from "../api/categoriesApi";
import { ArticleCard } from "../components/ArticleCard";
import { Pagination } from "../components/Pagination";
import { Spinner } from "../components/Spinner";
import { useLanguage } from "../context/LanguageContext";
import type { Article } from "../types/article";
import type { Category } from "../types/category";

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
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchArticles({ page, pageSize: 6, categoryId });
        setArticles(data.items);
        setTotalPages(data.totalPages || 1);
      } catch {
        setError(t("error"));
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [page, categoryId, t]);

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("articles")}</h1>
          <p className="mt-1 text-ink-500">{t("welcome")}</p>
        </div>

        <select
          value={categoryId ?? ""}
          onChange={(e) => {
            setPage(1);
            setCategoryId(e.target.value ? Number(e.target.value) : null);
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {language === "ka" ? c.nameKa : c.nameEn}
            </option>
          ))}
        </select>
      </div>

      {loading && <Spinner />}
      {!loading && error && <p className="mt-6 text-red-600">{error}</p>}
      {!loading && !error && articles.length === 0 && (
        <p className="mt-6 text-ink-500">{t("noArticles")}</p>
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
            prevLabel={t("prev")}
            nextLabel={t("next")}
          />
        </>
      )}
    </section>
  );
}
