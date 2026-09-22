import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/features/auth/AuthContext";
import { authService } from "@/features/auth/authService";
import AuthLayout from "@/layouts/AuthLayout";
import { parseApiError } from "@/utils/parseApiError";

export default function VendorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authService.loginVendor(form);
      login(result, "vendor");
      navigate("/vendor/dashboard");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Run your stall"
      subtitle="Log in to manage products, orders, and your storefront."
      footer={
        <>
          New seller?{" "}
          <Link to="/vendor/register" className="font-semibold text-primary hover:underline">
            Open a stall
          </Link>
          <span className="mx-2 text-line">·</span>
          <Link to="/login" className="text-ink-soft hover:underline">
            Shopping instead?
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" loading={loading} className="mt-2 w-full">
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}
