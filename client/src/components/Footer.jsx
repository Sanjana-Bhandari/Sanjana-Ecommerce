import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { siteConfig } from '../config/siteConfig';
import { categories } from '../config/constants';
import { callLink, whatsappLink } from '../utils/helpers';

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-slate-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl font-extrabold text-white">{siteConfig.storeName}</h3>
          <p className="mt-3 text-sm text-slate-400">{siteConfig.tagline}. Chat with us anytime to ask about price, size or availability.</p>
          <div className="mt-4 flex gap-3">
            {[
              { icon: FaInstagram, href: siteConfig.social.instagram, label: 'Instagram' },
              { icon: FaFacebookF, href: siteConfig.social.facebook, label: 'Facebook' },
              { icon: FaWhatsapp, href: whatsappLink(), label: 'WhatsApp' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg transition hover:-translate-y-1 hover:bg-brand-500"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Shop</h4>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.name}>
                <Link to={`/shop?category=${encodeURIComponent(c.name)}`} className="hover:text-brand-400">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">My Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/my-orders" className="hover:text-brand-400">My Orders</Link></li>
            <li><Link to="/login" className="hover:text-brand-400">Login</Link></li>
            <li><Link to="/register" className="hover:text-brand-400">Create account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Contact us</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-400">
                <FaWhatsapp /> WhatsApp us
              </a>
            </li>
            <li>
              <a href={callLink()} className="flex items-center gap-2 hover:text-brand-400">
                <FaPhoneAlt /> {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-brand-400">
                <FaEnvelope /> {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {siteConfig.storeName}. All rights reserved.
      </div>
    </footer>
  );
}
