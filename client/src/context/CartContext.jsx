import { createContext, useContext, useEffect, useState } from 'react';
import { FREE_SHIPPING_ABOVE, SHIPPING_FEE } from '../config/siteConfig';

const CartContext = createContext(null);
const KEY = 'gg_cart';

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items]);

  const addItem = (product, qty = 1) => {
    if (!product.stock) return;
    setItems((prev) => {
      const found = prev.find((i) => i.id === product._id);
      if (found) {
        return prev.map((i) => (i.id === product._id ? { ...i, stock: product.stock, qty: Math.min(i.qty + qty, product.stock) } : i));
      }
      return [
        ...prev,
        {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock,
          qty: Math.min(qty, product.stock),
        },
      ];
    });
  };

  const setQty = (id, qty) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i)));

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        shipping,
        total,
        addItem,
        setQty,
        removeItem,
        clear,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
