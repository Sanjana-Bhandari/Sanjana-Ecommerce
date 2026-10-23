export const categories = [
  { name: 'Girls Wear', emoji: '👗', gradient: 'from-pink-400 to-rose-500', blurb: 'Dresses, co-ords & more' },
  { name: 'Boys Wear', emoji: '👕', gradient: 'from-sky-400 to-indigo-500', blurb: 'Shirts, tees & jeans' },
  { name: 'Sarees', emoji: '🥻', gradient: 'from-amber-400 to-red-500', blurb: 'Silk, cotton & party wear' },
  { name: 'Cosmetics', emoji: '💄', gradient: 'from-fuchsia-400 to-pink-500', blurb: 'Lipstick, serum & more' },
  { name: 'Aesthetic Items', emoji: '🕯️', gradient: 'from-violet-400 to-purple-500', blurb: 'Decor to make rooms cozy' },
];

export const statusLabels = {
  placed: 'Order placed',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  delivery_failed: 'Delivery failed',
  refused: 'Refused by customer',
  rto_received: 'Returned to seller',
  returned: 'Return received',
  cancelled: 'Cancelled',
};

export const statusColors = {
  placed: 'bg-blue-100 text-blue-700',
  packed: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-violet-100 text-violet-700',
  out_for_delivery: 'bg-amber-100 text-amber-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  delivery_failed: 'bg-orange-100 text-orange-700',
  refused: 'bg-rose-100 text-rose-700',
  rto_received: 'bg-rose-100 text-rose-700',
  returned: 'bg-slate-200 text-slate-700',
  cancelled: 'bg-slate-200 text-slate-600',
};

export const paymentLabels = {
  pending: 'Payment pending',
  paid: 'Paid',
  paid_demo: 'Paid (demo)',
  failed: 'Payment failed',
};
