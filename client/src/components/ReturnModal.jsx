import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { shortId } from '../utils/helpers';

// Admin: record what came back for an order (customer refused it, or returned it later).
export default function ReturnModal({ order, onClose, onDone }) {
  const toast = useToast();
  const [type, setType] = useState(['refused', 'delivery_failed', 'rto_received'].includes(order?.status) ? 'RTO' : 'CUSTOMER_RETURN');
  const [rows, setRows] = useState(() =>
    (order?.items || []).map((it) => ({ product: it.product, name: it.name, max: it.qty, qty: it.qty, condition: 'good', selected: true }))
  );
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (i, patch) => setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const submit = async (e) => {
    e.preventDefault();
    const items = rows.filter((r) => r.selected).map((r) => ({ product: r.product, qty: Number(r.qty), condition: r.condition }));
    if (items.length === 0) {
      toast.error('Select at least one returned item');
      return;
    }
    setSaving(true);
    try {
      await api.post('/returns', { orderId: order._id, type, items, reason });
      toast.success('Return saved. Good items were added back to stock.');
      onDone();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={Boolean(order)} onClose={onClose} title={`Record return · Order #${order ? shortId(order._id) : ''}`} wide>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">What happened?</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input">
            <option value="RTO">Customer did not take the parcel (came back to me)</option>
            <option value="CUSTOMER_RETURN">Customer returned it after delivery</option>
          </select>
        </div>

        <div className="space-y-3">
          <p className="label">Items that came back</p>
          {rows.map((r, i) => (
            <div key={r.product} className="flex flex-wrap items-center gap-3 rounded-xl border border-brand-100 p-3">
              <input type="checkbox" checked={r.selected} onChange={(e) => update(i, { selected: e.target.checked })} className="accent-rose-600" />
              <span className="min-w-[8rem] flex-1 text-sm font-medium">{r.name}</span>
              <input type="number" min="1" max={r.max} value={r.qty} onChange={(e) => update(i, { qty: e.target.value })} className="input w-20" aria-label="Quantity" />
              <select value={r.condition} onChange={(e) => update(i, { condition: e.target.value })} className="input w-auto">
                <option value="good">Good</option>
                <option value="damaged">Damaged</option>
                <option value="missing">Missing</option>
              </select>
            </div>
          ))}
          <p className="text-xs text-slate-500">Items marked “Good” are added back to your stock automatically.</p>
        </div>

        <div>
          <label className="label">Reason / note</label>
          <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} className="input" placeholder="e.g. Customer was not available, wrong size..." />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save return'}</Button>
        </div>
      </form>
    </Modal>
  );
}
