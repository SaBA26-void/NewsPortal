import { Link } from "react-router-dom";
import type { Article } from "../types/article";
import type { Language } from "../context/LanguageContext";

type Props = {
  article: Article;
  language: Language;
  readMoreLabel: string;
};

export function ArticleCard({ article, language, readMoreLabel }: Props) {
  const category =
    language === "ka" ? article.categoryNameKa : article.categoryNameEn;

  const text =
    article.content.length > 120
      ? article.content.slice(0, 120) + "..."
      : article.content;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {article.imageUrl && (
        <Link to={`/articles/${article.id}`}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-40 w-full object-cover"
          />
        </Link>
      )}
      <div className="p-4">
        <p className="text-xs font-medium text-brand-600">{category}</p>
        <h2 className="mt-1 text-lg font-semibold">
          <Link to={`/articles/${article.id}`} className="hover:text-brand-600">
            {article.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm text-ink-500">{text}</p>
        <div className="mt-3 flex justify-between text-xs text-ink-500">
          <span>{article.authorName}</span>
          <Link to={`/articles/${article.id}`} className="text-brand-600">
            {readMoreLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
