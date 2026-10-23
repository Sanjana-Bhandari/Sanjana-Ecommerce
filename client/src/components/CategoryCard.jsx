import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -10, rotate: -1.5 }}
    >
      <Link
        to={`/shop?category=${encodeURIComponent(category.name)}`}
        className={`group relative flex h-48 flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br ${category.gradient} p-5 text-white shadow-lg transition-shadow hover:shadow-2xl`}
      >
        <span className="absolute -right-2 -top-2 text-7xl opacity-90 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125">
          {category.emoji}
        </span>
        <h3 className="font-display text-xl font-bold leading-tight">{category.name}</h3>
        <p className="text-xs text-white/85">{category.blurb}</p>
        <span className="mt-2 text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100">Shop now →</span>
      </Link>
    </motion.div>
  );
}
