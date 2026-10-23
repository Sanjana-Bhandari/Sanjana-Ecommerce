import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { HiMinus, HiPlus } from 'react-icons/hi';
import ProductImage from '../components/ProductImage';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Reveal from '../components/Reveal';
import useProducts from '../hooks/useProducts';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { callLink, discountPercent, formatPrice, whatsappLink } from '../utils/helpers';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [state, setState] = useState('loading'); // loading | ok | missing
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    setQty(1);
    api
      .get(`/products/${id}`)
      .then((d) => {
        if (cancelled) return;
        setProduct(d.product);
        setState('ok');
      })
      .catch(() => !cancelled && setState('missing'));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const { products: related } = useProducts(product ? `category=${encodeURIComponent(product.category)}&limit=5` : '');

  if (state === 'loading') {
    return (
      <div className="container-page grid gap-10 py-12 md:grid-cols-2">
        <div className="skeleton aspect-square animate-shimmer rounded-3xl" />
        <div className="space-y-4">
          <div className="skeleton h-6 w-1/3 animate-shimmer rounded" />
          <div className="skeleton h-10 w-3/4 animate-shimmer rounded" />
          <div className="skeleton h-24 w-full animate-shimmer rounded" />
        </div>
      </div>
    );
  }
  if (state === 'missing' || !product) {
    return <EmptyState emoji="😕" title="Product not found" actionLabel="Back to shop" actionTo="/shop" />;
  }

  const off = discountPercent(product.price, product.mrp);
  const soldOut = product.stock <= 0;
  const waMessage = `Hi! I would like to know the price and details of "${product.name}".`;

  const add = () => {
    addItem(product, qty);
    toast.success('Added to cart');
    openCart();
  };
  const buyNow = () => {
    addItem(product, qty);
    navigate('/checkout');
  };

  return (
    <div className="container-page py-10">
      <p className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-brand-600">Home</Link> / <Link to="/shop" className="hover:text-brand-600">Shop</Link> /{' '}
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-600">{product.category}</Link>
      </p>

      <div className="grid gap-10 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="card relative aspect-square overflow-hidden rounded-3xl">
          <ProductImage product={product} />
          {off > 0 && <span className="absolute left-4 top-4 rounded-full bg-brand-500 px-4 py-1.5 text-sm font-bold text-white shadow">{off}% OFF</span>}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <StarRating value={product.rating} />
            <span className={`text-xs font-semibold ${soldOut ? 'text-rose-600' : product.stock <= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {soldOut ? 'Sold out' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
            {product.mrp > product.price && <span className="text-lg text-slate-400 line-through">{formatPrice(product.mrp)}</span>}
          </div>

          <p className="mt-5 leading-relaxed text-slate-600">{product.description || 'Message us on WhatsApp for more details about this product.'}</p>

          {!soldOut && (
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center rounded-full border border-brand-200 bg-white">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3" aria-label="Decrease"><HiMinus /></button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-3" aria-label="Increase"><HiPlus /></button>
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <Button onClick={add} disabled={soldOut} icon={FaShoppingBag} size="lg">Add to cart</Button>
            <Button onClick={buyNow} disabled={soldOut} variant="dark" size="lg">Buy now</Button>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-800">Want to ask something?</p>
            <p className="text-xs text-emerald-700">Talk to us directly about price, size or availability.</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button href={whatsappLink(waMessage)} external variant="whatsapp" size="sm" icon={FaWhatsapp}>Ask on WhatsApp</Button>
              <Button href={callLink()} variant="outline" size="sm" icon={FaPhoneAlt}>Call us</Button>
            </div>
          </div>
        </motion.div>
      </div>

      {related.filter((p) => p._id !== product._id).length > 0 && (
        <section className="mt-20">
          <Reveal><h2 className="mb-6 font-display text-2xl font-bold">You may also like</h2></Reveal>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.filter((p) => p._id !== product._id).slice(0, 4).map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
