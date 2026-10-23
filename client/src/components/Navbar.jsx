import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaShoppingBag, FaUserCircle } from 'react-icons/fa';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { siteConfig } from '../config/siteConfig';
import AnnouncementBar from './AnnouncementBar';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=Sarees', label: 'Sarees' },
  { to: '/shop?category=Cosmetics', label: 'Cosmetics' },
];

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-brand-600 ${isActive ? 'text-brand-600' : 'text-slate-600'}`;

export default function Navbar() {
  const { count, openCart } = useCart();
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const [account, setAccount] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAccount(false);
    setMenu(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40">
      <AnnouncementBar />
      <div className="border-b border-brand-100 bg-white/80 backdrop-blur-lg">
        <nav className="container-page flex items-center justify-between py-3">
          <Link to="/" className="font-display text-2xl font-extrabold">
            <span className="gradient-text">{siteConfig.storeName}</span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <NavLink to={l.to} end={l.end} className={l.label === 'Shop' || l.label === 'Home' ? linkClass : () => linkClass({ isActive: false })}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-lg text-brand-600 transition hover:scale-110 hover:bg-brand-100"
            >
              <FaShoppingBag />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 1.8 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white"
                >
                  {count}
                </motion.span>
              )}
            </button>

            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setAccount((a) => !a)}
                  className="flex items-center gap-2 rounded-full bg-brand-50 py-1.5 pl-2 pr-4 text-sm font-medium text-brand-700 transition hover:bg-brand-100"
                >
                  <FaUserCircle className="text-xl" />
                  {user.name.split(' ')[0]}
                </button>
                <AnimatePresence>
                  {account && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="card absolute right-0 mt-2 w-48 overflow-hidden py-1 text-sm shadow-xl"
                    >
                      <Link to="/my-orders" onClick={() => setAccount(false)} className="block px-4 py-2 hover:bg-brand-50">
                        My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setAccount(false)} className="block px-4 py-2 hover:bg-brand-50">
                          Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-rose-600 hover:bg-brand-50">
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white transition hover:scale-105 md:block"
              >
                Login
              </Link>
            )}

            <button className="text-2xl text-ink md:hidden" onClick={() => setMenu((m) => !m)} aria-label="Toggle menu">
              {menu ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menu && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-brand-100 bg-white md:hidden"
            >
              {links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} onClick={() => setMenu(false)} className="block px-6 py-3 text-sm font-medium text-slate-700">
                    {l.label}
                  </Link>
                </li>
              ))}
              {user ? (
                <>
                  <li>
                    <Link to="/my-orders" onClick={() => setMenu(false)} className="block px-6 py-3 text-sm font-medium text-slate-700">
                      My Orders
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link to="/admin" onClick={() => setMenu(false)} className="block px-6 py-3 text-sm font-medium text-slate-700">
                        Admin Panel
                      </Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="block w-full px-6 py-3 text-left text-sm font-medium text-rose-600">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" onClick={() => setMenu(false)} className="block px-6 py-3 text-sm font-semibold text-brand-600">
                    Login / Sign up
                  </Link>
                </li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
