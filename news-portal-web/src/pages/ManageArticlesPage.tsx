import axios from "axios";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  createArticle,
  deleteArticle,
  fetchArticles,
  updateArticle,
  type ArticleWritePayload,
} from "../api/articlesApi";
import { fetchCategories } from "../api/categoriesApi";
import { EmptyState } from "../components/EmptyState";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import type { Article } from "../types/article";
import type { Category } from "../types/category";

const emptyForm: ArticleWritePayload = {
  title: "",
  content: "",
  imageUrl: "",
  categoryId: 0,
};

export function ManageArticlesPage() {
  const { t, language } = useLanguage();
  const { user, isSuperAdmin } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ArticleWritePayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const applyArticleFilter = useCallback(
    (items: Article[]) =>
      isSuperAdmin
        ? items
        : items.filter((a) => a.authorId === user?.id),
    [isSuperAdmin, user?.id],
  );

  const loadArticles = useCallback(async () => {
    const data = await fetchArticles({ page: 1, pageSize: 50 });
    setArticles(applyArticleFilter(data.items));
  }, [applyArticleFilter]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [cats, data] = await Promise.all([
          fetchCategories(),
          fetchArticles({ page: 1, pageSize: 50 }),
        ]);
        if (cancelled) return;
        setCategories(cats);
        setArticles(applyArticleFilter(data.items));
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
  }, [applyArticleFilter, t]);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.id - b.id),
    [categories],
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (article: Article) => {
    setEditingId(article.id);
    setForm({
      title: article.title,
      content: article.content,
      imageUrl: article.imageUrl ?? "",
      categoryId: article.categoryId,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.content.trim() || !form.categoryId) {
      setError(t("selectCategory"));
      return;
    }

    const payload: ArticleWritePayload = {
      title: form.title.trim(),
      content: form.content.trim(),
      imageUrl: form.imageUrl?.trim() || null,
      categoryId: Number(form.categoryId),
    };

    try {
      setSaving(true);
      if (editingId) {
        await updateArticle(editingId, payload);
      } else {
        await createArticle(payload);
      }
      resetForm();
      await loadArticles();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? t("errorGeneric"));
      } else {
        setError(t("errorGeneric"));
      }
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!window.confirm(t("confirmDelete"))) return;

    try {
      await deleteArticle(id);
      if (editingId === id) resetForm();
      await loadArticles();
    } catch {
      setError(t("errorGeneric"));
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950";

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("manageArticles")}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {isSuperAdmin ? t("allArticlesAdmin") : t("myArticles")}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="font-semibold">
          {editingId ? t("editArticle") : t("newArticle")}
        </h2>

        <label className="block text-sm">
          <span className="mb-1 block text-ink-500">{t("title")}</span>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            maxLength={200}
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-ink-500">{t("content")}</span>
          <textarea
            className={`${inputClass} min-h-[140px]`}
            value={form.content}
            onChange={(e) =>
              setForm((f) => ({ ...f, content: e.target.value }))
            }
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-ink-500">{t("imageUrl")}</span>
          <input
            className={inputClass}
            value={form.imageUrl ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, imageUrl: e.target.value }))
            }
            placeholder="https://..."
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-ink-500">{t("category")}</span>
          <select
            className={inputClass}
            value={form.categoryId || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, categoryId: Number(e.target.value) }))
            }
            required
          >
            <option value="">{t("selectCategory")}</option>
            {sortedCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {language === "ka" ? c.nameKa : c.nameEn}
              </option>
            ))}
          </select>
        </label>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? t("loggingIn") : t("save")}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
            >
              {t("cancel")}
            </button>
          )}
        </div>
      </form>

      {loading && <Spinner />}

      {!loading && articles.length === 0 && (
        <EmptyState
          title={t("noArticles")}
          description={t("noArticlesHint")}
        />
      )}

      {!loading && articles.length > 0 && (
        <ul className="space-y-3">
          {articles.map((article) => (
            <li
              key={article.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <p className="font-semibold text-ink-900 dark:text-white">
                  {article.title}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  {language === "ka"
                    ? article.categoryNameKa
                    : article.categoryNameEn}
                  {" · "}
                  {article.authorName}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(article)}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700"
                >
                  {t("editArticle")}
                </button>
                <button
                  type="button"
                  onClick={() => void onDelete(article.id)}
                  className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 dark:border-red-800"
                >
                  {t("deleteArticle")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
