import { api } from "./axiosInstance";
import type { Category } from "../types/category";

export async function fetchCategories() {
  const res = await api.get<Category[]>("/Categories");
  return res.data;
}
