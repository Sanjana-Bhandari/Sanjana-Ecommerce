import { statusColors, statusLabels, paymentLabels } from '../config/constants';

export function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColors[status] || 'bg-slate-100 text-slate-600'}`}>
      {statusLabels[status] || status}
    </span>
  );
}

export function PaymentBadge({ payment }) {
  const color =
    payment.status === 'paid' || payment.status === 'paid_demo'
      ? 'bg-emerald-100 text-emerald-700'
      : payment.status === 'failed'
      ? 'bg-rose-100 text-rose-700'
      : 'bg-amber-100 text-amber-700';
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      {payment.method === 'COD' ? 'COD' : 'Online'} · {paymentLabels[payment.status]}
    </span>
  );
}
