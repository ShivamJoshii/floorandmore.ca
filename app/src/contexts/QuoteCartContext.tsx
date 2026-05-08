import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface QuoteCartItem {
  productId: number;
  name: string;
  slug: string;
  image: string;
  price: string;
  salePrice: string | null;
  quantity: number;
  sku: string;
  size: string | null;
  colour: string | null;
  collectionName: string | null;
}

interface QuoteCartContextType {
  items: QuoteCartItem[];
  addItem: (item: QuoteCartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const QuoteCartContext = createContext<QuoteCartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
});

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteCartItem[]>(() => {
    try {
      const stored = localStorage.getItem("teranova_quote_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("teranova_quote_cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((newItem: QuoteCartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === newItem.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <QuoteCartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount }}
    >
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart() {
  return useContext(QuoteCartContext);
}
