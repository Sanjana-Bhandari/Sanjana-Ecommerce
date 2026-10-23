import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiSearch } from 'react-icons/hi';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { ProductGridSkeleton } from '../components/Skeletons';
import useProducts from '../hooks/useProducts';
import { categories } from '../config/constants';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'newest';
  const search = params.get('search') || '';
  const [text, setText] = useState(search);

  // Wait until the user stops typing, then update the search
  useEffect(() => {
    const t = setTimeout(() => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (text.trim()) next.set('search', text.trim());
          else next.delete('search');
          return next;
        },
        { replace: true }
      );
    }, 400);
    return () => clearTimeout(t);
  }, [text, setParams]);

  const setParam = (key, value) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });

  const query = new URLSearchParams({ ...(category && { category }), ...(search && { search }), sort }).toString();
  const { products, loading, error } = useProducts(query);

  const chip = (active) =>
    `rounded-full px-4 py-2 text-sm font-medium transition hover:scale-105 ${
      active ? 'bg-gradient-to-r from-brand-500 to-fuchsia-500 text-white shadow-md' : 'border border-brand-200 bg-white text-slate-600 hover:bg-brand-50'
    }`;

  return (
    <div className="container-page py-12">
      <SectionTitle eyebrow="Shop" title={category || 'All Products'} subtitle="Pick your favourites and add them to your cart." />

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setParam('category', '')} className={chip(!category)}>All</button>
          {categories.map((c) => (
            <button key={c.name} onClick={() => setParam('category', c.name)} className={chip(category === c.name)}>
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 lg:w-64">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search products..." className="input pl-9" />
          </div>
          <select value={sort} onChange={(e) => setParam('sort', e.target.value)} className="input w-auto">
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : error ? (
        <EmptyState emoji="⚠️" title="Could not load products" text={error} />
      ) : products.length === 0 ? (
        <EmptyState emoji="🔍" title="No products found" text="Try another category or search." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
