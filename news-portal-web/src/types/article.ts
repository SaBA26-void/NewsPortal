export type Article = {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  categoryId: number;
  categoryNameKa: string;
  categoryNameEn: string;
  authorId: number;
  authorName: string;
};

export type PagedArticles = {
  items: Article[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};
