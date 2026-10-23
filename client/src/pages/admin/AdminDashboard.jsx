import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from '../../components/CountUp';
import { StatusBadge } from '../../components/StatusBadge';
import { api } from '../../services/api';
import { formatDate, formatPrice, shortId } from '../../utils/helpers';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/stats').then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-rose-600">{error}</p>;
  if (!data) return <div className="skeleton h-40 animate-shimmer rounded-2xl" />;

  const { stats, recentOrders, lowStock } = data;
  const cards = [
    { label: 'Total orders', value: stats.totalOrders, emoji: '📦', color: 'from-sky-400 to-indigo-500' },
    { label: 'Delivered', value: stats.delivered, emoji: '✅', color: 'from-emerald-400 to-teal-500' },
    { label: 'Failed / refused / RTO', value: stats.failedOrRefused, emoji: '↩️', color: 'from-orange-400 to-rose-500' },
    { label: 'Customer returns', value: stats.returned, emoji: '🔁', color: 'from-violet-400 to-purple-500' },
    { label: 'Revenue (delivered)', value: stats.revenue, prefix: '₹', emoji: '💰', color: 'from-amber-400 to-orange-500' },
    { label: 'Products', value: stats.products, emoji: '🛍️', color: 'from-pink-400 to-rose-500' },
    { label: 'Customers', value: stats.customers, emoji: '👥', color: 'from-fuchsia-400 to-pink-500' },
    { label: 'Return records', value: stats.returnsCount, emoji: '📋', color: 'from-slate-400 to-slate-600' },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -5 }}
            className={`rounded-2xl bg-gradient-to-br ${c.color} p-5 text-white shadow-lg`}
          >
            <span className="text-3xl">{c.emoji}</span>
            <p className="mt-3 text-3xl font-bold"><CountUp value={c.value} prefix={c.prefix} /></p>
            <p className="text-xs text-white/90">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-xl font-bold">Recent orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-slate-500">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-brand-100">
              {recentOrders.map((o) => (
                <li key={o._id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <div>
                    <p className="font-semibold">#{shortId(o._id)} · {o.user?.name || 'Customer'}</p>
                    <p className="text-xs text-slate-500">{formatDate(o.createdAt)}</p>
                  </div>
                  <StatusBadge status={o.status} />
                  <p className="font-bold">{formatPrice(o.totalPrice)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-display text-xl font-bold">Low stock</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-slate-500">All products are well stocked.</p>
          ) : (
            <ul className="space-y-3">
              {lowStock.map((p) => (
                <li key={p._id} className="flex items-center justify-between text-sm">
                  <span className="line-clamp-1">{p.name}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${p.stock === 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.stock === 0 ? 'Sold out' : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
