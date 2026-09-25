import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuth } from "@/features/auth/AuthContext";
import { useCart } from "@/features/cart/CartContext";
import { cartService } from "@/features/cart/cartService";
import { productService } from "@/features/products/productService";
import { vendorAccent } from "@/utils/vendorAccent";

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function DetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-5xl animate-pulse grid-cols-1 gap-10 px-4 py-10 sm:grid-cols-2">
      <div className="aspect-square rounded-card bg-ink/5" />
      <div className="space-y-4">
        <div className="h-4 w-1/3 rounded bg-ink/5" />
        <div className="h-8 w-2/3 rounded bg-ink/5" />
        <div className="h-6 w-1/4 rounded bg-ink/5" />
        <div className="h-24 w-full rounded bg-ink/5" />
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { role } = useAuth();
  const { refresh: refreshCart } = useCart();
  const { push } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    productService
      .retrieve(slug)
      .then((data) => {
        setProduct(data);
        setActiveImage(0);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <DetailSkeleton />;

  if (notFound || !product) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-4 py-24 text-center">
        <h1 className="font-display text-xl font-semibold text-ink">This stall moved on</h1>
        <p className="text-sm text-ink-soft">
          That product isn't available anymore — it may have been removed or is no longer
          approved.
        </p>
        <Link to="/" className="mt-2 text-sm font-semibold text-primary hover:underline">
          Back to browsing
        </Link>
      </div>
    );
  }

  const accent = vendorAccent(product.vendor);
  const hasDiscount =
    product.discount_price && Number(product.discount_price) < Number(product.price);
  const images = product.images?.length ? product.images : [];
  const variants = product.variants || [];

  // Group variants by attribute_name (e.g. Color -> [Black, White], Size -> [S, M, L])
  const variantGroups = variants.reduce((acc, v) => {
    (acc[v.attribute_name] ||= []).push(v);
    return acc;
  }, {});

  async function handleAddToCart() {
    if (role && role !== "customer") {
      push("Only customer accounts can add items to a cart", "error");
      return;
    }
    setAdding(true);
    try {
      await cartService.add({
        productId: product.id,
        variantId: selectedVariant?.id,
        quantity,
      });
      await refreshCart();
      push(`Added ${quantity} to cart`);
    } catch (err) {
      push(err.response?.data?.message || "Couldn't add that to your cart", "error");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink">
        ← Back to browsing
      </Link>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-card border border-line bg-paper-raised">
            <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
            <div className="aspect-square w-full bg-ink/[0.03]">
              {images.length > 0 ? (
                <img
                  src={images[activeImage]?.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-ink-soft/30">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
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
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                    activeImage === i ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img.image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <Link
            to={`/?vendor=${product.vendor}`}
            className="text-sm font-medium uppercase tracking-wide"
            style={{ color: accent }}
          >
            {product.vendor_name}
          </Link>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-semibold text-ink">
              {formatPrice(product.effective_price ?? product.price)}
            </span>
            {hasDiscount && (
              <span className="text-base text-ink-soft/50 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {product.brand && (
            <p className="mt-3 text-sm text-ink-soft">
              Brand: <span className="text-ink">{product.brand}</span>
            </p>
          )}

          {product.description && (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
              {product.description}
            </p>
          )}

          {Object.entries(variantGroups).map(([attrName, options]) => (
            <div key={attrName} className="mt-5">
              <p className="mb-2 text-sm font-medium text-ink">{attrName}</p>
              <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedVariant(opt)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors
                      ${
                        selectedVariant?.id === opt.id
                          ? "border-ink bg-ink text-white"
                          : "border-line text-ink-soft hover:border-ink"
                      }`}
                  >
                    {opt.attribute_value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-line">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-ink-soft hover:text-ink"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center font-mono text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-ink-soft hover:text-ink"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              loading={adding}
              className="flex-1"
              disabled={product.status !== "approved"}
            >
              Add to cart
            </Button>
          </div>

          {product.status !== "approved" && (
            <p className="mt-3">
              <Badge status={product.status} />
              <span className="ml-2 text-xs text-ink-soft">
                This product isn't currently purchasable.
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
