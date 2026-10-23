import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/returns', label: 'Returns' },
];

export default function AdminLayout() {
  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
      <nav className="mt-5 flex flex-wrap gap-2 border-b border-brand-100 pb-4">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `rounded-full px-5 py-2 text-sm font-semibold transition hover:scale-105 ${
                isActive ? 'bg-gradient-to-r from-brand-500 to-fuchsia-500 text-white shadow' : 'bg-white text-slate-600 hover:bg-brand-50'
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
