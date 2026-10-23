import { useCallback, useEffect, useState } from 'react';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import ProductImage from '../../components/ProductImage';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { categories } from '../../config/constants';
import { formatPrice } from '../../utils/helpers';

const emptyForm = { name: '', description: '', category: categories[0].name, price: '', mrp: '', stock: '', image: '', featured: false };

export default function AdminProducts() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api
      .get('/products?limit=100')
      .then((d) => setProducts(d.products))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(load, [load]);

  const openNew = () => {
    setForm(emptyForm);
    setEditing('new');
  };
  const openEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description || '',
      category: p.category,
      price: p.price,
      mrp: p.mrp || '',
      stock: p.stock,
      image: p.image || '',
      featured: p.featured,
    });
    setEditing(p);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, price: Number(form.price), mrp: Number(form.mrp) || 0, stock: Number(form.stock) };
    try {
      if (editing === 'new') await api.post('/products', body);
      else await api.put(`/products/${editing._id}`, body);
      toast.success('Product saved');
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await api.delete(`/products/${p._id}`);
      toast.success('Product deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Products ({products.length})</h2>
        <Button onClick={openNew} icon={HiPlus} size="sm">Add product</Button>
      </div>

      {loading ? (
        <div className="skeleton h-40 animate-shimmer rounded-2xl" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-brand-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg"><ProductImage product={p} /></div>
                      <span className="font-medium">{p.name}{p.featured && ' ⭐'}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-500">{p.category}</td>
                  <td className="p-3 font-semibold">{formatPrice(p.price)}</td>
                  <td className={`p-3 font-semibold ${p.stock <= 3 ? 'text-rose-600' : ''}`}>{p.stock}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2 text-lg">
                      <button onClick={() => openEdit(p)} aria-label="Edit" className="rounded-full bg-brand-50 p-2 text-brand-600 hover:bg-brand-100"><HiPencil /></button>
                      <button onClick={() => remove(p)} aria-label="Delete" className="rounded-full bg-rose-50 p-2 text-rose-600 hover:bg-rose-100"><HiTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add product' : 'Edit product'} wide>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Name</label>
            <input required value={form.name} onChange={set('name')} className="input" />
          </div>
          <div>
            <label className="label">Category</label>
            <select value={form.category} onChange={set('category')} className="input">
              {categories.map((c) => <option key={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Stock</label>
            <input required type="number" min="0" value={form.stock} onChange={set('stock')} className="input" />
          </div>
          <div>
            <label className="label">Selling price (₹)</label>
            <input required type="number" min="0" value={form.price} onChange={set('price')} className="input" />
          </div>
          <div>
            <label className="label">MRP / original price (₹)</label>
            <input type="number" min="0" value={form.mrp} onChange={set('mrp')} className="input" placeholder="Optional, shows discount" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Image URL</label>
            <input value={form.image} onChange={set('image')} className="input" placeholder="https://... (leave empty to show an emoji tile)" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea rows={3} value={form.description} onChange={set('description')} className="input" />
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={form.featured} onChange={set('featured')} className="accent-rose-600" /> Show on the home page (featured)
          </label>
          <div className="flex justify-end gap-3 sm:col-span-2">
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save product'}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
