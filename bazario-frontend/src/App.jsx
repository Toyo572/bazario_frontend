import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ToastProvider } from "@/components/ui/ToastProvider";
import AdminLogin from "@/features/auth/admin/AdminLogin";
import { AuthProvider } from "@/features/auth/AuthContext";
import CustomerLogin from "@/features/auth/customer/CustomerLogin";
import CustomerRegister from "@/features/auth/customer/CustomerRegister";
import VendorLogin from "@/features/auth/vendor/VendorLogin";
import VendorRegister from "@/features/auth/vendor/VendorRegister";
import { CartProvider } from "@/features/cart/CartContext";
import CartPage from "@/features/cart/CartPage";
import CheckoutPage from "@/features/orders/CheckoutPage";
import { OrderDetailPage, OrderListPage } from "@/features/orders/OrderPages";
import ProductDetailPage from "@/features/products/pages/ProductDetailPage";
import ProductListPage from "@/features/products/pages/ProductListPage";
import CustomerLayout from "@/layouts/CustomerLayout";
import ComingSoon from "@/routes/ComingSoon";
import ProtectedRoute from "@/routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <Routes>
              {/* Auth pages — no shell, full-page centered card */}
              <Route path="/login" element={<CustomerLogin />} />
              <Route path="/register" element={<CustomerRegister />} />
              <Route path="/vendor/login" element={<VendorLogin />} />
              <Route path="/vendor/register" element={<VendorRegister />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Customer-facing storefront */}
              <Route element={<CustomerLayout />}>
                <Route path="/" element={<ProductListPage />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <OrderListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Role dashboards — stubbed for now, layouts come next */}
              <Route
                path="/vendor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["vendor"]}>
                    <ComingSoon title="Vendor dashboard" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["superadmin"]}>
                    <ComingSoon title="Admin dashboard" />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
