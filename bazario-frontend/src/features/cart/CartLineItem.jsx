import { Link } from "react-router-dom";

import { vendorAccent } from "@/utils/vendorAccent";

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

export default function CartLineItem({ item, onUpdateQuantity, onRemove, onSaveForLater, busy }) {
  const accent = vendorAccent(item.product.vendor);

  return (
    <div className="flex gap-4 border-b border-line py-5 last:border-0">
      <Link
        to={`/products/${item.product.slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-ink/[0.03]"
      >
        <span
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        {item.product.featured_image && (
          <img
            src={item.product.featured_image}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/products/${item.product.slug}`}
              className="font-medium text-ink hover:underline"
            >
              {item.product.name}
            </Link>
            {item.variant && (
              <p className="text-xs text-ink-soft">
                {item.variant.attribute_name}: {item.variant.attribute_value}
              </p>
            )}
          </div>
          <span className="shrink-0 font-mono text-sm font-semibold text-ink">
            {formatPrice(item.subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full border border-line">
              <button
                disabled={busy}
                onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                className="px-2.5 py-1 text-ink-soft hover:text-ink disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-6 text-center font-mono text-xs">{item.quantity}</span>
              <button
                disabled={busy}
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="px-2.5 py-1 text-ink-soft hover:text-ink disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              disabled={busy}
              onClick={() => onSaveForLater(item.id)}
              className="text-xs font-medium text-ink-soft hover:text-ink hover:underline disabled:opacity-40"
            >
              Save for later
            </button>
          </div>
          <button
            disabled={busy}
            onClick={() => onRemove(item.id)}
            className="text-xs font-medium text-danger hover:underline disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
