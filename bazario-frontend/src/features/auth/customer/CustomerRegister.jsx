import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/features/auth/AuthContext";
import { authService } from "@/features/auth/authService";
import AuthLayout from "@/layouts/AuthLayout";
import { parseApiError } from "@/utils/parseApiError";

export default function CustomerRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authService.registerCustomer(form);
      login(result, "customer");
      navigate("/");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Browse and buy from every independent seller on Bazario."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full name"
          name="full_name"
          required
          value={form.full_name}
          onChange={update("full_name")}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={update("email")}
        />
        <Input
          label="Phone number"
          name="phone_number"
          type="tel"
          value={form.phone_number}
          onChange={update("phone_number")}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={form.password}
          onChange={update("password")}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" loading={loading} className="mt-2 w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
