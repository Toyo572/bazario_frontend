import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "@/features/products/components/ProductCard";
import { categoryService, productService } from "@/features/products/productService";

function CategoryRail({ categories, active, onSelect }) {
  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors
          ${!active ? "bg-ink text-white" : "bg-ink/5 text-ink-soft hover:bg-ink/10"}`}
      >
        All stalls
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors
            ${active === cat.id ? "bg-ink text-white" : "bg-ink/5 text-ink-soft hover:bg-ink/10"}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-card border border-line">
          <div className="aspect-square bg-ink/5" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/2 rounded bg-ink/5" />
            <div className="h-4 w-3/4 rounded bg-ink/5" />
            <div className="h-4 w-1/3 rounded bg-ink/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ search }) {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <h3 className="font-display text-xl font-semibold text-ink">No stalls have that yet</h3>
      <p className="max-w-sm text-sm text-ink-soft">
        {search
          ? `Nothing matched "${search}". Try a different word, or browse by category instead.`
          : "This category is empty right now — check back soon or browse everything."}
      </p>
    </div>
  );
}

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService.tree().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    productService
      .list({ search: search || undefined, category: activeCategory || undefined })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, activeCategory]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {search ? (
            <>
              Results for <span className="text-primary">"{search}"</span>
            </>
          ) : (
            "One marketplace. Every stall keeps its own name."
          )}
        </h1>
        {!search && (
          <p className="mt-2 max-w-xl text-ink-soft">
            Every product below is run by an independent seller — that colored strip on each
            card is theirs.
          </p>
        )}
      </section>

      <div className="mb-8">
        <CategoryRail
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <EmptyState search={search} />
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
