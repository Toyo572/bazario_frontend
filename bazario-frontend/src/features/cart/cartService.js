import axiosClient from "@/api/axiosClient";
import { ENDPOINTS } from "@/api/endpoints";

export const cartService = {
  async list() {
    const { data } = await axiosClient.get(ENDPOINTS.cart);
    return data.data;
  },
  async summary() {
    const { data } = await axiosClient.get(ENDPOINTS.cartSummary);
    return data.data;
  },
  async add({ productId, variantId, quantity = 1 }) {
    const { data } = await axiosClient.post(ENDPOINTS.cart, {
      product_id: productId,
      variant_id: variantId || undefined,
      quantity,
    });
    return data.data;
  },
  async updateQuantity(itemId, quantity) {
    const { data } = await axiosClient.patch(`${ENDPOINTS.cart}${itemId}/`, { quantity });
    return data.data;
  },
  async remove(itemId) {
    await axiosClient.delete(`${ENDPOINTS.cart}${itemId}/`);
  },
  async saveForLater(itemId) {
    const { data } = await axiosClient.post(`${ENDPOINTS.cart}${itemId}/save-for-later/`);
    return data.data;
  },
  async moveToCart(itemId) {
    const { data } = await axiosClient.post(`${ENDPOINTS.cart}${itemId}/move-to-cart/`);
    return data.data;
  },
  async savedItems() {
    const { data } = await axiosClient.get(`${ENDPOINTS.cart}saved-items/`);
    return data.data;
  },
  async clear() {
    await axiosClient.post(`${ENDPOINTS.cart}clear/`);
  },
};
