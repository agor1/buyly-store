import api from "./api";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const getCategories = async () => {
  try {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};
