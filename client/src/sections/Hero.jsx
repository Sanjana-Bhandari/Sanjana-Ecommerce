import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import Button from '../components/Button';
import { whatsappLink } from '../utils/helpers';

const floaters = [
  { e: '👗', cls: 'left-[5%] top-[20%] text-6xl', delay: '0s' },
  { e: '💄', cls: 'left-[12%] bottom-[12%] text-5xl', delay: '1.2s' },
  { e: '🥻', cls: 'right-[6%] top-[18%] text-6xl', delay: '0.6s' },
  { e: '🕯️', cls: 'right-[13%] bottom-[14%] text-5xl', delay: '1.8s' },
  { e: '👕', cls: 'left-[42%] top-[6%] text-4xl', delay: '2.4s' },
  { e: '✨', cls: 'right-[34%] bottom-[8%] text-4xl', delay: '0.9s' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } };

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-cream to-cream">
      {/* drifting colour blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-20 top-10 h-80 w-80 animate-blob rounded-full bg-brand-300/40 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-80 w-80 animate-blob rounded-full bg-amber-200/60 blur-3xl" style={{ animationDelay: '-4s' }} />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 animate-blob rounded-full bg-fuchsia-300/40 blur-3xl" style={{ animationDelay: '-8s' }} />
        {floaters.map((f) => (
          <span key={f.e} className={`absolute hidden animate-float opacity-80 drop-shadow-lg sm:block ${f.cls}`} style={{ animationDelay: f.delay }}>
            {f.e}
          </span>
        ))}
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="container-page relative py-24 text-center sm:py-32">
        <motion.span variants={item} className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-brand-600 backdrop-blur">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" /> New arrivals are here
        </motion.span>

        <motion.h1 variants={item} className="mx-auto mt-6 max-w-4xl font-display text-5xl font-extrabold leading-tight text-ink sm:text-7xl">
          Style that speaks.
          <br />
          <span className="gradient-text">Beauty that glows.</span>
        </motion.h1>

        <motion.p variants={item} className="mx-auto mt-6 max-w-xl text-slate-600">
          Girls &amp; boys wear, sarees, cosmetics and aesthetic decor — all in one place. Shop online or message us on WhatsApp to ask the price.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button to="/shop" size="lg">Shop Now</Button>
          <Button href={whatsappLink()} external variant="whatsapp" size="lg" icon={FaWhatsapp}>Ask on WhatsApp</Button>
        </motion.div>

        <motion.ul variants={item} className="mt-10 flex flex-wrap justify-center gap-3 text-xs font-medium text-slate-600">
          {['🚚 Free shipping above ₹999', '💸 Cash on Delivery', '🔁 Easy returns', '🔒 Secure payments'].map((t) => (
            <li key={t} className="rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur">{t}</li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
