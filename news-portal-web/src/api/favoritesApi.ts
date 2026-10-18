import { api } from "./axiosInstance";
import type { Article } from "../types/article";

export async function fetchMyFavorites() {
  const res = await api.get<Article[]>("/Favorites");
  return res.data;
}

export async function checkFavorite(articleId: number) {
  const res = await api.get<{ isFavorite: boolean }>(
    `/Favorites/check/${articleId}`,
  );
  return res.data.isFavorite;
}

export async function addFavorite(articleId: number) {
  await api.post(`/Favorites/${articleId}`);
}

export async function removeFavorite(articleId: number) {
  await api.delete(`/Favorites/${articleId}`);
}
