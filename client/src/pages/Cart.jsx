import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi';
import ProductImage from '../components/ProductImage';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export default function Cart() {
  const { items, setQty, removeItem, subtotal, shipping, total } = useCart();

  if (items.length === 0) {
    return <EmptyState title="Your cart is empty" text="Add something you love." actionLabel="Start shopping" actionTo="/shop" />;
  }

  return (
    <div className="container-page py-12">
      <h1 className="mb-8 font-display text-3xl font-bold">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -60 }} className="card flex gap-4 p-4">
                <Link to={`/product/${item.id}`} className="h-28 w-24 shrink-0 overflow-hidden rounded-xl">
                  <ProductImage product={item} />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link to={`/product/${item.id}`} className="font-semibold hover:text-brand-600">{item.name}</Link>
                    <p className="text-xs text-slate-500">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-brand-200">
                      <button onClick={() => setQty(item.id, item.qty - 1)} className="p-2" aria-label="Decrease"><HiMinus /></button>
                      <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
                      <button onClick={() => setQty(item.id, item.qty + 1)} className="p-2" aria-label="Increase"><HiPlus /></button>
                    </div>
                    <p className="font-bold">{formatPrice(item.price * item.qty)}</p>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} aria-label="Remove" className="self-start text-slate-400 hover:text-rose-600"><HiTrash /></button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <aside className="card h-fit space-y-3 p-6">
          <h2 className="font-display text-xl font-bold">Order Summary</h2>
          <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between text-sm text-slate-600"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
          <div className="flex justify-between border-t border-brand-100 pt-3 text-lg font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
          <Button to="/checkout" className="w-full">Proceed to Checkout</Button>
          <Link to="/shop" className="block text-center text-sm font-medium text-brand-600">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
