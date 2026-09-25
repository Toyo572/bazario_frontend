import { Link } from "react-router-dom";

import { vendorAccent } from "@/utils/vendorAccent";

function formatPrice(value) {
  const n = Number(value);
  return `$${n.toFixed(2)}`;
}

export default function ProductCard({ product }) {
  const accent = vendorAccent(product.vendor);
  const hasDiscount =
    product.discount_price && Number(product.discount_price) < Number(product.price);

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-card border border-line bg-paper-raised
        shadow-stall transition-shadow duration-200 hover:shadow-stall-hover"
    >
      {/* The stall strip — this vendor's color, everywhere their products appear */}
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />

      <div className="aspect-square w-full bg-ink/[0.03]">
        {product.featured_image ? (
          <img
            src={product.featured_image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft/30">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-ink-soft">
          {product.vendor_name}
        </p>
        <h3 className="mt-1 truncate font-medium text-ink">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2 font-mono">
          <span className="text-base font-semibold text-ink">
            {formatPrice(product.effective_price ?? product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-ink-soft/50 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
