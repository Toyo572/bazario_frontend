import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import { useCart } from "@/features/cart/CartContext";
import { cartService } from "@/features/cart/cartService";
import CartLineItem from "@/features/cart/CartLineItem";

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold text-ink">Your cart is empty</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        Nothing here yet — browse the marketplace and add something from any stall.
      </p>
      <Link to="/" className="mt-2">
        <Button>Start browsing</Button>
      </Link>
    </div>
  );
}

export default function CartPage() {
  const { items, summary, loading, refresh } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);

  async function loadSavedItems() {
    setSavedLoading(true);
    try {
      const data = await cartService.savedItems();
      setSavedItems(data);
    } finally {
      setSavedLoading(false);
    }
  }

  useEffect(() => {
    loadSavedItems();
  }, []);

  async function withBusy(itemId, fn) {
    setBusyId(itemId);
    try {
      await fn();
      await Promise.all([refresh(), loadSavedItems()]);
    } catch (err) {
      push(err.response?.data?.message || "That didn't work — try again", "error");
    } finally {
      setBusyId(null);
    }
  }

  const handleUpdateQuantity = (itemId, quantity) =>
    withBusy(itemId, () => cartService.updateQuantity(itemId, quantity));
  const handleRemove = (itemId) => withBusy(itemId, () => cartService.remove(itemId));
  const handleSaveForLater = (itemId) =>
    withBusy(itemId, async () => {
      await cartService.saveForLater(itemId);
      push("Saved for later");
    });
  const handleMoveToCart = (itemId) =>
    withBusy(itemId, async () => {
      await cartService.moveToCart(itemId);
      push("Moved back to cart");
    });

  const stillLoading = (loading && items.length === 0) || savedLoading;

  if (stillLoading) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse space-y-4 px-4 py-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-card bg-ink/5" />
        ))}
      </div>
    );
  }

  // Only truly empty if BOTH the active cart and saved-for-later are empty —
  // otherwise a saved item would be invisible with no way to get it back.
  if (items.length === 0 && savedItems.length === 0) return <EmptyCart />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Your cart</h1>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="sm:col-span-2">
          {items.length === 0 ? (
            <p className="rounded-card border border-dashed border-line py-10 text-center text-sm text-ink-soft">
              Nothing in your active cart — everything's saved for later below.
            </p>
          ) : (
            items.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                busy={busyId === item.id}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
                onSaveForLater={handleSaveForLater}
              />
            ))
          )}

          {savedItems.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-3 font-display text-base font-semibold text-ink">
                Saved for later ({savedItems.length})
              </h2>
              <div className="divide-y divide-line rounded-card border border-line bg-paper-raised">
                {savedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="truncate font-medium text-ink hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-ink-soft">
                          {item.variant.attribute_name}: {item.variant.attribute_value}
                        </p>
                      )}
                      <p className="font-mono text-xs text-ink-soft">
                        {formatPrice(item.unit_price)} · qty {item.quantity}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      className="shrink-0"
                      disabled={busyId === item.id}
                      onClick={() => handleMoveToCart(item.id)}
                    >
                      Move to cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-fit rounded-card border border-line bg-paper-raised p-5 shadow-stall">
          <h2 className="font-display text-base font-semibold text-ink">Order summary</h2>
          <div className="mt-4 flex justify-between text-sm text-ink-soft">
            <span>{summary.item_count} item{summary.item_count !== 1 ? "s" : ""}</span>
            <span className="font-mono text-ink">{formatPrice(summary.subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-ink-soft">Shipping and tax calculated at checkout.</p>
          <Button
            className="mt-5 w-full"
            disabled={items.length === 0}
            onClick={() => navigate("/checkout")}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
