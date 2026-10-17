import { api } from "./axiosInstance";
import type { Article, PagedArticles } from "../types/article";

export async function fetchArticles(params: {
  page?: number;
  pageSize?: number;
  categoryId?: number | null;
}) {
  const res = await api.get<PagedArticles>("/Articles", {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      categoryId: params.categoryId ?? undefined,
    },
  });
  return res.data;
}

export async function fetchArticleById(id: number) {
  const res = await api.get<Article>(`/Articles/${id}`);
  return res.data;
}
