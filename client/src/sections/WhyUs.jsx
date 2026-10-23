import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';

const features = [
  { emoji: '🚚', title: 'Fast delivery', text: 'Quick dispatch and tracking for every order.' },
  { emoji: '💸', title: 'Cash on Delivery', text: 'Pay when your parcel reaches you, or pay online.' },
  { emoji: '🔁', title: 'Easy returns', text: 'Not happy? Contact us and we will sort it out.' },
  { emoji: '💬', title: 'Chat support', text: 'Ask price and details directly on WhatsApp.' },
];

export default function WhyUs() {
  return (
    <section className="container-page pt-20">
      <SectionTitle eyebrow="Why us" title="Shop with confidence" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="card p-6 text-center transition-shadow hover:shadow-xl hover:shadow-brand-200/50"
          >
            <span className="inline-block text-4xl transition-transform hover:scale-125">{f.emoji}</span>
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
