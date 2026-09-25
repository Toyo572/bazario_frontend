import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/AuthContext";
import { useCart } from "@/features/cart/CartContext";

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="21" r="1.2" fill="currentColor" />
      <circle cx="17" cy="21" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function CustomerLayout() {
  const { user, role, logout } = useAuth();
  const { summary } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    navigate(search ? `/?search=${encodeURIComponent(search)}` : "/");
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-line bg-paper-raised/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3.5">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="font-display text-lg font-bold tracking-tight">bazario</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/50"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M21 21l-4.3-4.3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search across every stall"
                className="w-full rounded-full border border-line bg-paper py-2 pl-10 pr-4 text-sm
                  focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </form>

          <nav className="flex shrink-0 items-center gap-5 text-sm font-medium">
            {role === "customer" && (
              <>
                <Link to="/orders" className="hidden text-ink-soft hover:text-ink sm:inline">
                  Orders
                </Link>
                <Link
                  to="/cart"
                  className="relative text-ink-soft hover:text-ink"
                  aria-label="Cart"
                >
                  <CartIcon />
                  {summary.item_count > 0 && (
                    <span
                      className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center
                        rounded-full bg-primary px-1 font-mono text-[10px] font-semibold text-white"
                    >
                      {summary.item_count}
                    </span>
                  )}
                </Link>
              </>
            )}
            {user ? (
              <button onClick={logout} className="text-ink-soft hover:text-ink">
                Log out
              </button>
            ) : (
              <>
                <Link to="/login" className="text-ink-soft hover:text-ink">
                  Log in
                </Link>
                <Link
                  to="/vendor/login"
                  className="rounded-full border border-line px-3.5 py-1.5 text-ink-soft hover:border-ink hover:text-ink"
                >
                  Sell on Bazario
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-line py-10 text-center text-sm text-ink-soft">
        Bazario — a marketplace of independent stalls.
      </footer>
    </div>
  );
}
