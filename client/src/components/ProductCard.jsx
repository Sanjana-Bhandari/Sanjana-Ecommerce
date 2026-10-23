import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaWhatsapp } from 'react-icons/fa';
import ProductImage from './ProductImage';
import StarRating from './StarRating';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { discountPercent, formatPrice, whatsappLink } from '../utils/helpers';

export default function ProductCard({ product, index = 0 }) {
  const { addItem, openCart } = useCart();
  const toast = useToast();
  const off = discountPercent(product.price, product.mrp);
  const soldOut = product.stock <= 0;

  const handleAdd = () => {
    addItem(product, 1);
    toast.success('Added to cart');
    openCart();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -8 }}
      className="group card overflow-hidden transition-shadow hover:shadow-2xl hover:shadow-brand-200/60"
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
            <ProductImage product={product} />
          </div>
          {off > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white shadow">
              {off}% OFF
            </span>
          )}
          {soldOut && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-bold uppercase tracking-widest text-slate-600">
              Sold out
            </span>
          )}
        </div>
        <div className="p-4 pb-2">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-500">{product.category}</p>
          <h3 className="mt-1 line-clamp-1 font-semibold text-ink">{product.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-ink">{formatPrice(product.price)}</span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through">{formatPrice(product.mrp)}</span>
              )}
            </div>
            <StarRating value={product.rating} />
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2 p-4 pt-2">
        <button
          onClick={handleAdd}
          disabled={soldOut}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.03] active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          <FaShoppingBag /> Add to cart
        </button>
        <a
          href={whatsappLink(`Hi! I would like to know the price and details of "${product.name}".`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ask on WhatsApp"
          title="Ask on WhatsApp"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-lg text-white transition hover:scale-110"
        >
          <FaWhatsapp />
        </a>
      </div>
    </motion.article>
  );
}
