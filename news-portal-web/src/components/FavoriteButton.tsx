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

export function FavoriteButton({ articleId }: { articleId: number }) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoginHint, setShowLoginHint] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    checkFavorite(articleId)
      .then(setIsFavorite)
      .catch(() => setIsFavorite(false));
  }, [articleId, isAuthenticated]);

  const onClick = async () => {
    if (!isAuthenticated) {
      setShowLoginHint(true);
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(articleId);
        setIsFavorite(false);
      } else {
        await addFavorite(articleId);
        setIsFavorite(true);
      }
    } catch {
      /* ignore */
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
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm disabled:opacity-60 ${
          isAuthenticated && isFavorite
            ? "border-brand-500 bg-brand-50 text-brand-700"
            : "border-slate-300 dark:border-slate-700"
        }`}
      >
        <Heart
          size={16}
          className={isAuthenticated && isFavorite ? "fill-current" : ""}
        />
        {isAuthenticated && isFavorite ? t("removeFavorite") : t("addFavorite")}
      </button>

      {showLoginHint && !isAuthenticated && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950/40">
          <p>{t("needLogin")}</p>
          <div className="mt-2 flex gap-2">
            <Link to="/login" className="text-brand-600">
              {t("login")}
            </Link>
            <Link to="/register" className="text-brand-600">
              {t("register")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
