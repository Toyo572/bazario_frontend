import axiosClient from "@/api/axiosClient";
import { ENDPOINTS } from "@/api/endpoints";

export const authService = {
  async registerCustomer(payload) {
    const { data } = await axiosClient.post(ENDPOINTS.auth.customerRegister, payload);
    return data.data;
  },
  async loginCustomer(payload) {
    const { data } = await axiosClient.post(ENDPOINTS.auth.customerLogin, payload);
    return data.data;
  },
  async registerVendor(payload) {
    const { data } = await axiosClient.post(ENDPOINTS.auth.vendorRegister, payload);
    return data.data;
  },
  async loginVendor(payload) {
    const { data } = await axiosClient.post(ENDPOINTS.auth.vendorLogin, payload);
    return data.data;
  },
  async loginAdmin(payload) {
    const { data } = await axiosClient.post(ENDPOINTS.auth.adminLogin, payload);
    return data.data;
  },
  async fetchMe() {
    const { data } = await axiosClient.get(ENDPOINTS.me);
    return data.data;
  },
};
