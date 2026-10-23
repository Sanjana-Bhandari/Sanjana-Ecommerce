import Hero from '../sections/Hero';
import Categories from '../sections/Categories';
import FeaturedProducts from '../sections/FeaturedProducts';
import OfferBanner from '../sections/OfferBanner';
import WhyUs from '../sections/WhyUs';

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <OfferBanner />
      <WhyUs />
    </>
  );
}
