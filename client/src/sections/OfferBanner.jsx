import { FaWhatsapp } from 'react-icons/fa';
import Reveal from '../components/Reveal';
import Button from '../components/Button';
import { whatsappLink } from '../utils/helpers';

// Animated gradient banner
export default function OfferBanner() {
  return (
    <section className="container-page pt-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-500 via-fuchsia-500 to-amber-400 bg-[length:200%_auto] animate-gradient p-8 text-center text-white sm:p-14">
          <span className="absolute left-6 top-4 animate-float text-4xl">✨</span>
          <span className="absolute bottom-4 right-8 animate-float text-5xl" style={{ animationDelay: '1s' }}>🛍️</span>
          <span className="absolute right-1/4 top-3 animate-float text-3xl" style={{ animationDelay: '2s' }}>💖</span>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/90">Special offer</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold sm:text-5xl">Free shipping on orders above ₹999</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">Buying in bulk or want a custom price? Message us on WhatsApp and we will help you out.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button to="/shop" variant="dark">Start shopping</Button>
            <Button href={whatsappLink('Hi! I want to ask about bulk orders / best price.')} external variant="whatsapp" icon={FaWhatsapp}>
              Chat for best price
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
