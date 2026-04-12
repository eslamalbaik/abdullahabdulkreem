import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Product, Identity } from "@shared/schema";

export interface CartItem {
  id: number;
  type: "product" | "identity";
  title: string;
  price: number;
  originalPrice?: number;
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
  isNotificationOpen: boolean;
  lastAddedItem: CartItem | null;
  closeNotification: () => void;
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

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    let itemToNotify: CartItem | null = null;
    
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id && item.type === newItem.type);
      let updatedItems;
      if (existing) {
        updatedItems = prev.map((item) =>
          item.id === newItem.id && item.type === newItem.type
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [...prev, { ...newItem, quantity: 1 }];
      }
      
      const addedItem = updatedItems.find(item => item.id === newItem.id && item.type === newItem.type);
      if (addedItem) {
        setLastAddedItem(addedItem);
        setIsNotificationOpen(true);
        itemToNotify = addedItem;
      }
      
      return updatedItems;
    });

    // Notify admin about item added to cart (Side effect outside updater)
    if (itemToNotify) {
      const item = itemToNotify as CartItem;
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'add_to_cart',
          title: 'إضافة منتج للسلة',
          message: `قام شخص بإضافة "${item.title}" إلى السلة`,
          data: { item }
        })
      }).catch(err => console.error('Error sending cart notification:', err));
    }
  };

  const closeNotification = () => setIsNotificationOpen(false);

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
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        totalItems, 
        totalPrice,
        isNotificationOpen,
        lastAddedItem,
        closeNotification
      }}
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
