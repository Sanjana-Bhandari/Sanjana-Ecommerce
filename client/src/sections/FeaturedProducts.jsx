import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { ProductGridSkeleton } from '../components/Skeletons';
import useProducts from '../hooks/useProducts';

export default function FeaturedProducts() {
  const { products, loading, error } = useProducts('featured=true&limit=8');

  return (
    <section className="container-page pt-20">
      <SectionTitle eyebrow="Trending" title="Featured Products" subtitle="Our customers' favourites this week." />
      {loading ? (
        <ProductGridSkeleton />
      ) : error ? (
        <p className="text-center text-slate-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-slate-500">No featured products yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
      )}
      <div className="mt-10 text-center">
        <Button to="/shop" variant="outline">View all products</Button>
      </div>
    </section>
  );
}
