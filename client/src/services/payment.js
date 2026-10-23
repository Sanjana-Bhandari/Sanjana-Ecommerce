import { api } from './api';
import { openRazorpay } from './razorpay';
import { siteConfig } from '../config/siteConfig';

// Pays for an ONLINE order. `payment` comes from the server (mode: 'razorpay' or 'demo').
export async function runOnlinePayment(order, payment, user) {
  if (payment.mode === 'demo') {
    const ok = window.confirm('DEMO MODE: no real money will be charged. Mark this order as paid?');
    if (!ok) throw new Error('Payment was cancelled');
    await api.post(`/orders/${order._id}/demo-pay`);
    return;
  }

  const response = await openRazorpay({
    keyId: payment.keyId,
    razorpayOrderId: payment.razorpayOrderId,
    amount: payment.amount,
    currency: payment.currency,
    storeName: siteConfig.storeName,
    prefill: { name: order.address.name, email: user?.email, contact: order.address.phone },
  });
  await api.post(`/orders/${order._id}/verify-payment`, response);
}
