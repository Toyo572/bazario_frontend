import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { cartService } from "@/features/cart/cartService";
import { useAuth } from "@/features/auth/AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, role } = useAuth();
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ item_count: 0, subtotal: 0 });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (role !== "customer") return;
    setLoading(true);
    try {
      const [itemsData, summaryData] = await Promise.all([
        cartService.list(),
        cartService.summary(),
      ]);
      setItems(itemsData);
      setSummary(summaryData);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (user && role === "customer") refresh();
    else {
      setItems([]);
      setSummary({ item_count: 0, subtotal: 0 });
    }
  }, [user, role, refresh]);

  return (
    <CartContext.Provider value={{ items, summary, loading, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
