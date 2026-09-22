const V = "/api/v1";

export const ENDPOINTS = {
  auth: {
    customerRegister: `${V}/auth/customer/register/`,
    customerLogin: `${V}/auth/customer/login/`,
    vendorRegister: `${V}/auth/vendor/register/`,
    vendorLogin: `${V}/auth/vendor/login/`,
    adminLogin: `${V}/auth/admin/login/`,
    refresh: `${V}/auth/token/refresh/`,
  },
  me: `${V}/users/me/`,
  categories: `${V}/categories/`,
  categoryTree: `${V}/categories/tree/`,
  products: `${V}/products/`,
  vendorProducts: `${V}/products/vendor/`,
  cart: `${V}/cart/`,
  cartSummary: `${V}/cart/summary/`,
  orders: `${V}/orders/`,
  checkout: `${V}/orders/checkout/`,
  vendorOrders: `${V}/orders/vendor/`,
  vendors: {
    me: `${V}/vendors/me/`,
    pending: `${V}/vendors/admin/pending/`,
    admin: `${V}/vendors/admin/`,
  },
  notifications: `${V}/notifications/`,
  wishlist: `${V}/wishlist/`,
};
