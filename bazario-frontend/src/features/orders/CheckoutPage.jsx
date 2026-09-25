import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";
import { useCart } from "@/features/cart/CartContext";
import { orderService } from "@/features/orders/orderService";
import { parseApiError } from "@/utils/parseApiError";

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

const DELIVERY_METHODS = [
  { value: "standard", label: "Standard" },
  { value: "express", label: "Express" },
  { value: "pickup", label: "Store pickup" },
];

const PAYMENT_METHODS = [
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "cash_on_delivery", label: "Cash on delivery" },
  { value: "wallet", label: "Wallet" },
];

export default function CheckoutPage() {
  const { summary, refresh } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shipping_full_name: "",
    shipping_phone: "",
    shipping_address: "",
    delivery_method: "standard",
    payment_method: "card",
    coupon_code: "",
  });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const payload = { ...form };
      if (!payload.coupon_code) delete payload.coupon_code;
      const orderGroup = await orderService.checkout(payload);
      await refresh();
      push("Order placed");
      navigate(`/orders/${orderGroup.id}`);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:col-span-2">
          <h2 className="font-display text-base font-semibold text-ink">Shipping details</h2>
          <Input
            label="Full name"
            name="shipping_full_name"
            required
            value={form.shipping_full_name}
            onChange={update("shipping_full_name")}
          />
          <Input
            label="Phone number"
            name="shipping_phone"
            type="tel"
            required
            value={form.shipping_phone}
            onChange={update("shipping_phone")}
          />
          <Input
            label="Delivery address"
            name="shipping_address"
            required
            value={form.shipping_address}
            onChange={update("shipping_address")}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-soft">Delivery method</label>
              <select
                value={form.delivery_method}
                onChange={update("delivery_method")}
                className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {DELIVERY_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-soft">Payment method</label>
              <select
                value={form.payment_method}
                onChange={update("payment_method")}
                className="rounded-xl border border-line px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Coupon code (optional)"
            name="coupon_code"
            value={form.coupon_code}
            onChange={update("coupon_code")}
            className="uppercase"
          />

          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" loading={placing} className="mt-2 w-full">
            Place order
          </Button>
        </form>

        <div className="h-fit rounded-card border border-line bg-paper-raised p-5 shadow-stall">
          <h2 className="font-display text-base font-semibold text-ink">Order total</h2>
          <div className="mt-4 flex justify-between text-sm text-ink-soft">
            <span>Subtotal</span>
            <span className="font-mono text-ink">{formatPrice(summary.subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            Final tax and shipping are confirmed after checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
