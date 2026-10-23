import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import Button from '../components/Button';
import { PaymentBadge } from '../components/StatusBadge';
import { api } from '../services/api';
import { formatPrice, shortId, whatsappLink } from '../utils/helpers';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((d) => setOrder(d.order)).catch(() => {});
  }, [id]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-5xl text-white shadow-xl shadow-emerald-300"
      >
        ✓
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 font-display text-3xl font-bold">
        Thank you! Your order is placed 🎉
      </motion.h1>
      {order && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 space-y-2">
          <p className="text-slate-600">Order <b>#{shortId(order._id)}</b> · Total <b>{formatPrice(order.totalPrice)}</b></p>
          <PaymentBadge payment={order.payment} />
        </motion.div>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/my-orders" className="rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white transition hover:scale-105">
          Track my order
        </Link>
        <Button to="/shop" variant="outline">Continue shopping</Button>
        {order && (
          <Button href={whatsappLink(`Hi! I placed order #${shortId(order._id)}.`)} external variant="whatsapp" icon={FaWhatsapp}>
            Message us
          </Button>
        )}
      </div>
    </div>
  );
}
