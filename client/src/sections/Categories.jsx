import SectionTitle from '../components/SectionTitle';
import CategoryCard from '../components/CategoryCard';
import { categories } from '../config/constants';

export default function Categories() {
  return (
    <section className="container-page pt-20">
      <SectionTitle eyebrow="Browse" title="Shop by Category" subtitle="Find exactly what you are looking for." />
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((c, i) => (
          <CategoryCard key={c.name} category={c} index={i} />
        ))}
      </div>
    </section>
  );
}
