import Reveal from './Reveal';

export default function SectionTitle({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <Reveal className={`mb-10 ${align === 'center' ? 'text-center' : ''}`}>
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
      {subtitle && <p className={`mt-3 max-w-2xl text-slate-500 ${align === 'center' ? 'mx-auto' : ''}`}>{subtitle}</p>}
      <div className={`mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand-400 to-amber-400 ${align === 'center' ? 'mx-auto' : ''}`} />
    </Reveal>
  );
}
