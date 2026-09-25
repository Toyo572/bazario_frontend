import axiosClient from "@/api/axiosClient";
import { ENDPOINTS } from "@/api/endpoints";

export const orderService = {
  async checkout(payload) {
    const { data } = await axiosClient.post(ENDPOINTS.checkout, payload);
    return data.data;
  },
  async list(params = {}) {
    const { data } = await axiosClient.get(ENDPOINTS.orders, { params });
    return data.data;
  },
  async retrieve(id) {
    const { data } = await axiosClient.get(`${ENDPOINTS.orders}${id}/`);
    return data.data;
  },
  async cancel(id, reason = "") {
    const { data } = await axiosClient.post(`${ENDPOINTS.orders}${id}/cancel/`, { reason });
    return data.data;
  },
};
