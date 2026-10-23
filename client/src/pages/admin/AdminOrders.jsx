import { useCallback, useEffect, useState } from 'react';
import ReturnModal from '../../components/ReturnModal';
import { PaymentBadge } from '../../components/StatusBadge';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { statusLabels } from '../../config/constants';
import { formatDate, formatPrice, shortId } from '../../utils/helpers';

export default function AdminOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [returnFor, setReturnFor] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get(`/orders${filter ? `?status=${filter}` : ''}`)
      .then((d) => setOrders(d.orders))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [filter, toast]);

  useEffect(load, [load]);

  const changeStatus = async (order, status) => {
    try {
      await api.patch(`/orders/${order._id}/status`, { status });
      toast.success(`Order #${shortId(order._id)} → ${statusLabels[status]}`);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold">Orders</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-auto">
          <option value="">All statuses</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="skeleton h-40 animate-shimmer rounded-2xl" />
      ) : orders.length === 0 ? (
        <p className="card p-8 text-center text-slate-500">No orders found.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-brand-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Items</th><th className="p-3">Total</th><th className="p-3">Payment</th><th className="p-3">Status</th><th className="p-3">Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100 align-top">
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="p-3">
                    <p className="font-semibold">#{shortId(o._id)}</p>
                    <p className="text-xs text-slate-500">{formatDate(o.createdAt)}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{o.address.name}</p>
                    <p className="text-xs text-slate-500">{o.address.phone}</p>
                    <p className="text-xs text-slate-500">{o.address.city}, {o.address.state} - {o.address.pincode}</p>
                  </td>
                  <td className="p-3 text-xs">
                    {o.items.map((it) => <p key={it.product}>{it.name} × {it.qty}</p>)}
                  </td>
                  <td className="p-3 font-semibold">{formatPrice(o.totalPrice)}</td>
                  <td className="p-3"><PaymentBadge payment={o.payment} /></td>
                  <td className="p-3">
                    <select value={o.status} onChange={(e) => changeStatus(o, e.target.value)} disabled={o.status === 'cancelled'} className="input w-auto py-2 text-xs">
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    {o.status !== 'cancelled' && (
                      <button onClick={() => setReturnFor(o)} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-100">
                        Record return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {returnFor && (
        <ReturnModal
          key={returnFor._id}
          order={returnFor}
          onClose={() => setReturnFor(null)}
          onDone={() => {
            setReturnFor(null);
            load();
          }}
        />
      )}
    </>
  );
}
