import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Product, Identity } from "@shared/schema";

export interface CartItem {
  id: number;
  type: "product" | "identity";
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number, type: "product" | "identity") => void;
  updateQuantity: (id: number, type: "product" | "identity", quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id && item.type === newItem.type);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id && item.type === newItem.type
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: number, type: "product" | "identity") => {
    setItems((prev) => prev.filter((item) => !(item.id === id && item.type === type)));
  };

  const updateQuantity = (id: number, type: "product" | "identity", quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, type);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.type === type ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
