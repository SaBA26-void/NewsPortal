import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchArticleById } from "../api/articlesApi";
import { Spinner } from "../components/Spinner";
import { useLanguage } from "../context/LanguageContext";
import type { Article } from "../types/article";

export function ArticleDetailPage() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await fetchArticleById(Number(id));
        if (cancelled) return;
        setArticle(data);
      } catch {
        if (!cancelled) {
          setArticle(null);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Spinner />;

  if (error || !article) {
    return (
      <section>
        <Link to="/" className="text-sm font-medium text-brand-600">
          ← {t("home")}
        </Link>
        <p className="mt-6 text-ink-500">{t("noArticles")}</p>
      </section>
    );
  }

  const category =
    language === "ka" ? article.categoryNameKa : article.categoryNameEn;

  return (
    <article>
      <Link to="/" className="text-sm font-medium text-brand-600">
        ← {t("home")}
      </Link>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-brand-600">
        {category}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{article.title}</h1>
      <p className="mt-2 text-sm text-ink-500 dark:text-slate-400">
        {article.authorName} ·{" "}
        {new Date(article.createdAt).toLocaleDateString()}
      </p>
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt=""
          className="mt-6 max-h-96 w-full rounded-xl object-cover"
        />
      )}
      <div className="mt-6 whitespace-pre-wrap leading-relaxed text-ink-700 dark:text-slate-200">
        {article.content}
      </div>
    </article>
  );
}
