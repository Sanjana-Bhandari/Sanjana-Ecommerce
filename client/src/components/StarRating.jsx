import { FaStar } from 'react-icons/fa';

export default function StarRating({ value = 0 }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
      <FaStar className="text-amber-400" /> {Number(value).toFixed(1)}
    </span>
  );
}
