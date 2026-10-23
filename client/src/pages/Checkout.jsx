import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ProductImage from '../components/ProductImage';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { runOnlinePayment } from '../services/payment';
import { formatPrice } from '../utils/helpers';

const fields = [
  { name: 'name', label: 'Full name', type: 'text', auto: 'name' },
  { name: 'phone', label: 'Phone number', type: 'tel', auto: 'tel' },
  { name: 'line1', label: 'Address (house, street, area)', type: 'text', auto: 'street-address', wide: true },
  { name: 'city', label: 'City', type: 'text', auto: 'address-level2' },
  { name: 'state', label: 'State', type: 'text', auto: 'address-level1' },
  { name: 'pincode', label: 'Pincode', type: 'text', auto: 'postal-code' },
];

export default function Checkout() {
  const { items, subtotal, shipping, total, clear } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ name: user?.name || '', phone: user?.phone || '', line1: '', city: '', state: '', pincode: '' });
  const [method, setMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return <EmptyState title="Nothing to checkout" text="Your cart is empty." actionLabel="Go to shop" actionTo="/shop" />;
  }

  const handleChange = (e) => setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));

  const placeOrder = async (e) => {
    e.preventDefault();
    if (fields.some((f) => !address[f.name].trim())) {
      toast.error('Please fill in the full delivery address');
      return;
    }
    if (!/^\d{6}$/.test(address.pincode.trim())) {
      toast.error('Pincode should be 6 digits');
      return;
    }

    setLoading(true);
    let order;
    try {
      const data = await api.post('/orders', {
        items: items.map((i) => ({ product: i.id, qty: i.qty })),
        address,
        paymentMethod: method,
      });
      order = data.order;
      clear();

      if (method === 'ONLINE') {
        try {
          await runOnlinePayment(order, data.payment, user);
        } catch (payErr) {
          // Order exists but is unpaid: the customer can pay later from My Orders
          toast.error(`${payErr.message}. You can pay from My Orders.`);
          navigate('/my-orders');
          return;
        }
      }
      navigate(`/order-success/${order._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const methodCard = (value, Icon, title, text) => (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition ${
        method === value ? 'border-brand-500 bg-brand-50' : 'border-brand-100 bg-white hover:border-brand-300'
      }`}
    >
      <input type="radio" name="method" value={value} checked={method === value} onChange={() => setMethod(value)} className="mt-1 accent-rose-600" />
      <div>
        <p className="flex items-center gap-2 font-semibold"><Icon className="text-brand-500" /> {title}</p>
        <p className="text-xs text-slate-500">{text}</p>
      </div>
    </label>
  );

  return (
    <div className="container-page py-12">
      <h1 className="mb-8 font-display text-3xl font-bold">Checkout</h1>
      <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="card p-6">
            <h2 className="mb-4 font-display text-xl font-bold">Delivery address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name} className={f.wide ? 'sm:col-span-2' : ''}>
                  <label htmlFor={f.name} className="label">{f.label}</label>
                  <input id={f.name} name={f.name} type={f.type} autoComplete={f.auto} value={address[f.name]} onChange={handleChange} className="input" />
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="mb-4 font-display text-xl font-bold">Payment method</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {methodCard('COD', FaMoneyBillWave, 'Cash on Delivery', 'Pay in cash when the parcel arrives.')}
              {methodCard('ONLINE', FaCreditCard, 'Pay online', 'UPI, cards and net banking.')}
            </div>
          </section>
        </div>

        <aside className="card h-fit space-y-3 p-6">
          <h2 className="font-display text-xl font-bold">Your order</h2>
          <ul className="max-h-60 space-y-3 overflow-y-auto">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 text-sm">
                <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg"><ProductImage product={i} /></div>
                <span className="flex-1 line-clamp-2">{i.name} × {i.qty}</span>
                <span className="font-semibold">{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-brand-100 pt-3 text-sm text-slate-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between text-sm text-slate-600"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
          <div className="flex justify-between border-t border-brand-100 pt-3 text-lg font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? 'Placing order...' : method === 'ONLINE' ? 'Place order & pay' : 'Place order'}
          </Button>
        </aside>
      </form>
    </div>
  );
}
