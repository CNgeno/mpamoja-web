import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { Wordmark } from '../components/PageHeader';
import { Button, Field, Banner } from '../components/ui';

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError('');
    if (!form.id || !form.password) { setError('Enter your email/phone and password.'); return; }
    setLoading(true);
    try {
      await login(form.id, form.password);
      nav(loc.state?.from?.pathname || '/app', { replace: true });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Sign in failed.');
    } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: '28px 22px' }}>
      <Wordmark />
      <h1 style={{ fontSize: '1.6rem', marginTop: 28 }}>Welcome back</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 22, fontSize: '0.9rem' }}>Sign in to manage your kitties.</p>
      <Banner kind="error">{error}</Banner>
      <Field label="Email or phone">
        <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="you@example.com or 0712\u2026" />
      </Field>
      <Field label="Password">
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" onKeyDown={(e) => e.key === 'Enter' && submit()} />
      </Field>
      <Button full loading={loading} onClick={submit}>Sign in</Button>
      <p style={{ textAlign: 'center', marginTop: 18, fontSize: '0.88rem', color: 'var(--muted)' }}>
        New here? <Link to="/register" style={{ fontWeight: 600 }}>Create an account</Link>
      </p>
    </div>
  );
}
