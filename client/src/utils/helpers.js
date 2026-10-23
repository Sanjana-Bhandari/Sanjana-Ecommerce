import { siteConfig } from '../config/siteConfig';

export const formatPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export const discountPercent = (price, mrp) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

export const formatDate = (d) =>
  new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const whatsappLink = (message = 'Hi! I would like to know more about your products.') =>
  `https://wa.me/${siteConfig.phoneNumber}?text=${encodeURIComponent(message)}`;

export const callLink = () => `tel:+${siteConfig.phoneNumber}`;

export const shortId = (id) => String(id).slice(-6).toUpperCase();
