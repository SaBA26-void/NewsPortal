import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchArticleById } from "../api/articlesApi";
import { FavoriteButton } from "../components/FavoriteButton";
import { Spinner } from "../components/Spinner";
import { useLanguage } from "../context/LanguageContext";
import type { Article } from "../types/article";

export function ArticleDetailPage() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        setArticle(await fetchArticleById(Number(id)));
      } catch {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  if (loading) return <Spinner />;

  if (!article) {
    return (
      <section>
        <Link to="/" className="text-brand-600">
          ← {t("home")}
        </Link>
        <p className="mt-4">{t("noArticles")}</p>
      </section>
    );
  }

  const category =
    language === "ka" ? article.categoryNameKa : article.categoryNameEn;

  return (
    <article>
      <Link to="/" className="text-sm text-brand-600">
        ← {t("home")}
      </Link>
      <p className="mt-4 text-xs font-medium text-brand-600">{category}</p>
      <h1 className="mt-2 text-3xl font-bold">{article.title}</h1>
      <p className="mt-2 text-sm text-ink-500">
        {article.authorName} ·{" "}
        {new Date(article.createdAt).toLocaleDateString()}
      </p>
      <div className="mt-4">
        <FavoriteButton articleId={article.id} />
      </div>
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt=""
          className="mt-6 max-h-96 w-full rounded-xl object-cover"
        />
      )}
      <div className="mt-6 whitespace-pre-wrap leading-relaxed">
        {article.content}
      </div>
    </article>
  );
}
