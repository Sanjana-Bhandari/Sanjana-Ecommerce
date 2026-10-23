import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiX, HiMinus, HiPlus, HiTrash } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import ProductImage from './ProductImage';
import { formatPrice } from '../utils/helpers';
import { FREE_SHIPPING_ABOVE } from '../config/siteConfig';

// Slide-in cart panel, opened from the navbar bag icon.
export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, removeItem, subtotal, shipping, total } = useCart();
  const navigate = useNavigate();
  const remaining = Math.max(0, FREE_SHIPPING_ABOVE - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_ABOVE) * 100);

  const goCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-brand-100 p-5">
              <h2 className="font-display text-2xl font-bold">Your Cart</h2>
              <button onClick={closeCart} aria-label="Close cart" className="text-2xl text-slate-500 hover:text-ink">
                <HiX />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <span className="animate-float text-6xl">🛍️</span>
                <p className="mt-4 font-semibold">Your cart is empty</p>
                <Link to="/shop" onClick={closeCart} className="mt-4 text-sm font-semibold text-brand-600">
                  Start shopping →
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-brand-100 px-5 py-3 text-xs">
                  {remaining > 0 ? (
                    <p>
                      Add <b>{formatPrice(remaining)}</b> more for <b className="text-brand-600">free shipping</b>
                    </p>
                  ) : (
                    <p className="font-semibold text-emerald-600">🎉 You get free shipping!</p>
                  )}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-100">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-brand-400 to-amber-400"
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <ul className="flex-1 space-y-4 overflow-y-auto p-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        className="flex gap-3"
                      >
                        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl">
                          <ProductImage product={item} />
                        </div>
                        <div className="flex-1">
                          <p className="line-clamp-1 text-sm font-semibold">{item.name}</p>
                          <p className="text-sm text-brand-600">{formatPrice(item.price)}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center rounded-full border border-brand-200">
                              <button onClick={() => setQty(item.id, item.qty - 1)} className="p-1.5" aria-label="Decrease">
                                <HiMinus />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                              <button onClick={() => setQty(item.id, item.qty + 1)} className="p-1.5" aria-label="Increase">
                                <HiPlus />
                              </button>
                            </div>
                            <button onClick={() => removeItem(item.id)} aria-label="Remove" className="text-slate-400 hover:text-rose-600">
                              <HiTrash />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="space-y-2 border-t border-brand-100 p-5 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <button
                    onClick={goCheckout}
                    className="mt-3 w-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 py-3 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:scale-[1.02] active:scale-95"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
