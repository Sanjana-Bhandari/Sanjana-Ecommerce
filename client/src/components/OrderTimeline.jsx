import { motion } from 'framer-motion';
import { statusLabels } from '../config/constants';
import { formatDate } from '../utils/helpers';

// Vertical timeline built from order.statusHistory
export default function OrderTimeline({ history = [] }) {
  return (
    <ol className="relative ml-3 border-l-2 border-brand-200">
      {history.map((h, i) => (
        <motion.li
          key={h._id || i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="mb-4 ml-5 last:mb-0"
        >
          <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand-500" />
          <p className="text-sm font-semibold">{statusLabels[h.status] || h.status}</p>
          {h.note && <p className="text-xs text-slate-500">{h.note}</p>}
          <p className="text-xs text-slate-400">{formatDate(h.at)}</p>
        </motion.li>
      ))}
    </ol>
  );
}
