import axiosClient from "@/api/axiosClient";
import { ENDPOINTS } from "@/api/endpoints";

export const productService = {
  async list(params = {}) {
    const { data } = await axiosClient.get(ENDPOINTS.products, { params });
    return data.data;
  },
  async retrieve(slug) {
    const { data } = await axiosClient.get(`${ENDPOINTS.products}${slug}/`);
    return data.data;
  },
};

export const categoryService = {
  async tree() {
    const { data } = await axiosClient.get(ENDPOINTS.categoryTree);
    return data.data;
  },
};
