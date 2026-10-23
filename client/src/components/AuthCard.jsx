import { motion } from 'framer-motion';

// Shared layout for the Login and Sign up pages
export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-10 h-72 w-72 animate-blob rounded-full bg-brand-300/40 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 animate-blob rounded-full bg-amber-200/60 blur-3xl" style={{ animationDelay: '-5s' }} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card relative w-full max-w-md p-8 shadow-2xl shadow-brand-200/50"
      >
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        <div className="mt-6">{children}</div>
        <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
      </motion.div>
    </div>
  );
}
