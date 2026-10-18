import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addFavorite,
  checkFavorite,
  removeFavorite,
} from "../api/favoritesApi";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

type Props = {
  articleId: number;
};

export function FavoriteButton({ articleId }: Props) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    const load = async () => {
      try {
        const value = await checkFavorite(articleId);
        if (!cancelled) setIsFavorite(value);
      } catch {
        if (!cancelled) setIsFavorite(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [articleId, isAuthenticated]);

  const favorite = isAuthenticated ? isFavorite : false;
  const guestPromptVisible = !isAuthenticated && showGuestPrompt;

  const onClick = async () => {
    if (!isAuthenticated) {
      setShowGuestPrompt(true);
      return;
    }

    try {
      setLoading(true);
      if (isFavorite) {
        await removeFavorite(articleId);
        setIsFavorite(false);
      } else {
        await addFavorite(articleId);
        setIsFavorite(true);
      }
    } catch {
      /* keep current UI state */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition disabled:opacity-60 ${
          favorite
            ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-700/30 dark:text-brand-100"
            : "border-slate-300 text-ink-700 hover:border-brand-500 dark:border-slate-700 dark:text-slate-200"
        }`}
      >
        <Heart size={16} className={favorite ? "fill-current" : ""} />
        {favorite ? t("removeFavorite") : t("addFavorite")}
      </button>

      {guestPromptVisible && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900/50 dark:bg-amber-950/40">
          <p className="font-medium text-ink-900 dark:text-white">
            {t("favoritesLoginTitle")}
          </p>
          <p className="mt-1 text-ink-500 dark:text-slate-400">
            {t("favoritesLoginHint")}
          </p>
          <div className="mt-3 flex gap-2">
            <Link
              to="/login"
              className="rounded-md bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700"
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
        </div>
      )}
    </div>
  );
}
