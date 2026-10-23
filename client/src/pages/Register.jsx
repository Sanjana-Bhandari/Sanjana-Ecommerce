import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome, ${user.name.split(' ')[0]}! Your account is ready.`);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account ✨"
      subtitle="Sign up to order, pay and track your parcels."
      footer={<>Already have an account? <Link to="/login" state={location.state} className="font-semibold text-brand-600">Login</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="label">Full name</label>
          <input id="name" required autoComplete="name" value={form.name} onChange={set('name')} className="input" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" required autoComplete="email" value={form.email} onChange={set('email')} className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="phone" className="label">Phone (optional)</label>
          <input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} className="input" placeholder="98765 43210" />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" type="password" required minLength={6} autoComplete="new-password" value={form.password} onChange={set('password')} className="input" placeholder="At least 6 characters" />
        </div>
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Creating account...' : 'Sign up'}</Button>
      </form>
    </AuthCard>
  );
}
