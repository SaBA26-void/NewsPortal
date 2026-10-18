import { useEffect, useState, type FormEvent } from "react";
import {
  createArticle,
  deleteArticle,
  fetchArticles,
  updateArticle,
} from "../api/articlesApi";
import { fetchCategories } from "../api/categoriesApi";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import type { Article } from "../types/article";
import type { Category } from "../types/category";

const emptyForm = {
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
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadData = async () => {
    const [cats, data] = await Promise.all([
      fetchCategories(),
      fetchArticles({ page: 1, pageSize: 50 }),
    ]);

    setCategories(cats);

    const list = isSuperAdmin
      ? data.items
      : data.items.filter((a) => a.authorId === user?.id);

    setArticles(list);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await loadData();
      } catch {
        setError(t("error"));
      } finally {
        setLoading(false);
      }
    };

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.content.trim() || !form.categoryId) {
      setError(t("selectCategory"));
      return;
    }

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      imageUrl: form.imageUrl.trim() || null,
      categoryId: form.categoryId,
    };

    try {
      setSaving(true);
      if (editingId) {
        await updateArticle(editingId, payload);
      } else {
        await createArticle(payload);
      }
      resetForm();
      await loadData();
    } catch {
      setError(t("error"));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!window.confirm(t("delete") + "?")) return;

    try {
      await deleteArticle(id);
      if (editingId === id) resetForm();
      await loadData();
    } catch {
      setError(t("error"));
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950";

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-bold">{t("manageArticles")}</h1>

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="font-semibold">
          {editingId ? t("edit") : t("newArticle")}
        </h2>

        <input
          className={inputClass}
          placeholder={t("title")}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          className={`${inputClass} min-h-[120px]`}
          placeholder={t("content")}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />

        <input
          className={inputClass}
          placeholder={t("imageUrl")}
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />

        <select
          className={inputClass}
          value={form.categoryId || ""}
          onChange={(e) =>
            setForm({ ...form, categoryId: Number(e.target.value) })
          }
          required
        >
          <option value="">{t("selectCategory")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {language === "ka" ? c.nameKa : c.nameEn}
            </option>
          ))}
        </select>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {saving ? t("wait") : t("save")}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border px-4 py-2 text-sm dark:border-slate-700"
            >
              {t("cancel")}
            </button>
          )}
        </div>
      </form>

      {loading && <Spinner />}

      {!loading && articles.length === 0 && (
        <p className="text-ink-500">{t("noArticles")}</p>
      )}

      {!loading &&
        articles.map((article) => (
          <div
            key={article.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <p className="font-semibold">{article.title}</p>
              <p className="text-xs text-ink-500">
                {language === "ka"
                  ? article.categoryNameKa
                  : article.categoryNameEn}{" "}
                · {article.authorName}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingId(article.id);
                  setForm({
                    title: article.title,
                    content: article.content,
                    imageUrl: article.imageUrl ?? "",
                    categoryId: article.categoryId,
                  });
                }}
                className="rounded-md border px-3 py-1.5 text-sm dark:border-slate-700"
              >
                {t("edit")}
              </button>
              <button
                type="button"
                onClick={() => onDelete(article.id)}
                className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        ))}
    </section>
  );
}
