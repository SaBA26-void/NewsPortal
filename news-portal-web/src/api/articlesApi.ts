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

export type ArticleWritePayload = {
  title: string;
  content: string;
  imageUrl?: string | null;
  categoryId: number;
};

export async function createArticle(data: ArticleWritePayload) {
  const res = await api.post<Article>("/Articles", data);
  return res.data;
}

export async function updateArticle(id: number, data: ArticleWritePayload) {
  const res = await api.put<Article>(`/Articles/${id}`, data);
  return res.data;
}

export async function deleteArticle(id: number) {
  await api.delete(`/Articles/${id}`);
}
