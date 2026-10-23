import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function EmptyState({ emoji = '🛍️', title, text, actionLabel, actionTo }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center py-16 text-center"
    >
      <span className="animate-float text-6xl">{emoji}</span>
      <h3 className="mt-4 font-display text-2xl font-bold">{title}</h3>
      {text && <p className="mt-2 max-w-sm text-slate-500">{text}</p>}
      {actionTo && (
        <Link
          to={actionTo}
          className="mt-6 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white transition hover:scale-105"
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
