import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/features/auth/AuthContext";
import { authService } from "@/features/auth/authService";
import AuthLayout from "@/layouts/AuthLayout";
import { parseApiError } from "@/utils/parseApiError";

export default function VendorRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    shop_name: "",
    description: "",
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
      const result = await authService.registerVendor(form);
      login(result, "vendor");
      navigate("/vendor/dashboard?welcome=1");
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Open your stall"
      subtitle="A Bazario admin reviews every new stall before it goes live — usually quick."
      footer={
        <>
          Already selling here?{" "}
          <Link to="/vendor/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Shop name"
          name="shop_name"
          required
          placeholder="e.g. Bob's Electronics"
          value={form.shop_name}
          onChange={update("shop_name")}
        />
        <Input
          label="Your name"
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
          Submit for review
        </Button>
      </form>
    </AuthLayout>
  );
}
