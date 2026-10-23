import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { formatDate, shortId } from '../../utils/helpers';

const conditionColors = { good: 'bg-emerald-100 text-emerald-700', damaged: 'bg-amber-100 text-amber-700', missing: 'bg-rose-100 text-rose-700' };

export default function AdminReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/returns')
      .then((d) => setReturns(d.returns))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="skeleton h-40 animate-shimmer rounded-2xl" />;
  if (error) return <p className="text-rose-600">{error}</p>;

  return (
    <>
      <h2 className="mb-5 font-display text-xl font-bold">Returned items ({returns.length})</h2>
      {returns.length === 0 ? (
        <p className="card p-8 text-center text-slate-500">
          No returns recorded yet. When a parcel comes back, open Orders and click “Record return”.
        </p>
      ) : (
        <ul className="space-y-4">
          {returns.map((r) => (
            <li key={r._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">Order #{r.order ? shortId(r.order._id) : '—'}</p>
                  <p className="text-xs text-slate-500">{formatDate(r.receivedAt)}{r.order?.address && ` · ${r.order.address.name}, ${r.order.address.city}`}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${r.type === 'RTO' ? 'bg-rose-100 text-rose-700' : 'bg-violet-100 text-violet-700'}`}>
                  {r.type === 'RTO' ? 'Not accepted (RTO)' : 'Customer return'}
                </span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {r.items.map((it, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-full border border-brand-100 px-3 py-1.5 text-xs">
                    {it.name} × {it.qty}
                    <span className={`rounded-full px-2 py-0.5 font-semibold ${conditionColors[it.condition]}`}>{it.condition}</span>
                  </li>
                ))}
              </ul>
              {r.reason && <p className="mt-3 text-sm text-slate-600">Note: {r.reason}</p>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
