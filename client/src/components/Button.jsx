import { Link } from 'react-router-dom';

const variants = {
  primary:
    'bg-gradient-to-r from-brand-500 to-fuchsia-500 text-white shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50',
  dark: 'bg-ink text-white hover:bg-black',
  outline: 'border border-brand-300 bg-white text-brand-600 hover:bg-brand-50',
  whatsapp: 'bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:brightness-95',
  ghost: 'text-slate-600 hover:bg-brand-50',
  danger: 'bg-rose-100 text-rose-700 hover:bg-rose-200',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

// Renders <Link> when `to` is set, <a> when `href` is set, otherwise <button>.
export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  external = false,
  className = '',
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 hover:scale-[1.04] active:scale-95 disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      {Icon && <Icon className="text-base" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
