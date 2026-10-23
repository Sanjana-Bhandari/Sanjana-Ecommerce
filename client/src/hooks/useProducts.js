import { useEffect, useState } from 'react';
import { api } from '../services/api';

// Fetches products. `query` is a query string like "category=Sarees&sort=price_asc".
export default function useProducts(query = '') {
  const [state, setState] = useState({ products: [], loading: true, error: '' });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: '' }));
    api
      .get(`/products${query ? `?${query}` : ''}`)
      .then((d) => !cancelled && setState({ products: d.products, loading: false, error: '' }))
      .catch((e) => !cancelled && setState({ products: [], loading: false, error: e.message }));
    return () => {
      cancelled = true;
    };
  }, [query]);

  return state;
}
