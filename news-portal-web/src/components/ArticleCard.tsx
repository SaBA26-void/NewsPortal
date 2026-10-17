import { Link } from "react-router-dom";
import type { Article } from "../types/article";
import type { Language } from "../types/language";

type Props = {
  article: Article;
  language: Language;
  readMoreLabel: string;
};

export function ArticleCard({ article, language, readMoreLabel }: Props) {
  const category =
    language === "ka" ? article.categoryNameKa : article.categoryNameEn;

  const excerpt =
    article.content.length > 140
      ? `${article.content.slice(0, 140)}…`
      : article.content;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-brand-500 dark:border-slate-800 dark:bg-slate-900">
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt=""
          className="h-40 w-full object-cover"
        />
      )}
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {category}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-ink-900 dark:text-white">
          <Link to={`/articles/${article.id}`} className="hover:text-brand-600">
            {article.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm text-ink-500 dark:text-slate-400">
          {excerpt}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
          <span>{article.authorName}</span>
          <Link
            to={`/articles/${article.id}`}
            className="font-medium text-brand-600"
          >
            {readMoreLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
