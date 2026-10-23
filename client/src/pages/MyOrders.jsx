import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import EmptyState from '../components/EmptyState';
import OrderTimeline from '../components/OrderTimeline';
import { StatusBadge, PaymentBadge } from '../components/StatusBadge';
import ProductImage from '../components/ProductImage';
import Button from '../components/Button';
import { api } from '../services/api';
import { runOnlinePayment } from '../services/payment';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDate, formatPrice, shortId, whatsappLink } from '../utils/helpers';

function OrderCard({ order, onPaid }) {
  const { user } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const needsPayment = order.payment.method === 'ONLINE' && order.payment.status === 'pending' && order.status !== 'cancelled';

  const payNow = async () => {
    setPaying(true);
    try {
      const data = await api.post(`/orders/${order._id}/pay`);
      await runOnlinePayment(order, data.payment, user);
      toast.success('Payment received');
      onPaid();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPaying(false);
    }
  };

  return (
    <motion.li layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">Order #{shortId(order._id)}</p>
          <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={order.status} />
          <PaymentBadge payment={order.payment} />
        </div>
      </div>

      <ul className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {order.items.map((it) => (
          <li key={it.product} className="flex shrink-0 items-center gap-2 text-xs">
            <div className="h-14 w-12 overflow-hidden rounded-lg"><ProductImage product={{ name: it.name, image: it.image }} /></div>
            <span className="max-w-[8rem]">{it.name} × {it.qty}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold">{formatPrice(order.totalPrice)}</p>
        <div className="flex flex-wrap gap-2">
          {needsPayment && <Button onClick={payNow} disabled={paying} size="sm">{paying ? 'Opening...' : 'Pay now'}</Button>}
          <Button onClick={() => setOpen((o) => !o)} variant="outline" size="sm">{open ? 'Hide tracking' : 'Track order'}</Button>
          <Button href={whatsappLink(`Hi! I have a question about order #${shortId(order._id)}.`)} external variant="whatsapp" size="sm" icon={FaWhatsapp}>
            Help
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-5 grid gap-5 border-t border-brand-100 pt-5 sm:grid-cols-2">
              <OrderTimeline history={order.statusHistory} />
              <div className="text-sm text-slate-600">
                <p className="mb-1 font-semibold text-ink">Delivering to</p>
                <p>{order.address.name} · {order.address.phone}</p>
                <p>{order.address.line1}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api
      .get('/orders/mine')
      .then((d) => setOrders(d.orders))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="mb-8 font-display text-3xl font-bold">My Orders</h1>
      {loading ? (
        <div className="space-y-4">{[1, 2].map((i) => <div key={i} className="skeleton h-40 animate-shimmer rounded-2xl" />)}</div>
      ) : error ? (
        <EmptyState emoji="⚠️" title="Could not load orders" text={error} />
      ) : orders.length === 0 ? (
        <EmptyState title="No orders yet" text="When you place an order it will show up here." actionLabel="Start shopping" actionTo="/shop" />
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => <OrderCard key={o._id} order={o} onPaid={load} />)}
        </ul>
      )}
    </div>
  );
}
