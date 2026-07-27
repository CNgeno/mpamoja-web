import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, ApiError } from '../api/client';
import { Wordmark } from '../components/PageHeader';
import { Button, Field, Banner } from '../components/ui';

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit() {
    setError('');
    if (!form.fullName || !form.phone || !form.email || !form.password) {
      setError('Please fill in all fields.'); return;
    }
    setLoading(true);
    try {
      await authApi.register(form.fullName, form.phone, form.email, form.password);
      nav('/verify', { state: { phone: form.phone } });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Registration failed.');
    } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: '28px 22px' }}>
      <Wordmark />
      <h1 style={{ fontSize: '1.6rem', marginTop: 28 }}>Create your account</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 22, fontSize: '0.9rem' }}>
        We\u2019ll send a code to verify your phone.
      </p>
      <Banner kind="error">{error}</Banner>
      <Field label="Full name"><input value={form.fullName} onChange={set('fullName')} placeholder="Wanjiru Kamau" /></Field>
      <Field label="Phone number" hint="Safaricom number registered with M-PESA">
        <input value={form.phone} onChange={set('phone')} placeholder="0712 345 678" inputMode="tel" />
      </Field>
      <Field label="Email"><input value={form.email} onChange={set('email')} placeholder="you@example.com" inputMode="email" /></Field>
      <Field label="Password" hint="At least 8 characters">
        <input type="password" value={form.password} onChange={set('password')} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" />
      </Field>
      <Button full loading={loading} onClick={submit}>Send verification code</Button>
      <p style={{ textAlign: 'center', marginTop: 18, fontSize: '0.88rem', color: 'var(--muted)' }}>
        Already registered? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
      </p>
    </div>
  );
}
