import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { Wordmark } from '../components/PageHeader';
import { Button, Field, Banner } from '../components/ui';

export default function VerifyOtp() {
  const { state } = useLocation();
  const nav = useNavigate();
  const { completeVerification } = useAuth();
  const phone = state?.phone || '';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => { if (!phone) nav('/register', { replace: true }); }, [phone, nav]);

  async function submit() {
    setError('');
    if (code.length < 6) { setError('Enter the 6-digit code.'); return; }
    setLoading(true);
    try {
      await completeVerification(phone, code);
      nav('/app', { replace: true });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Verification failed.');
    } finally { setLoading(false); }
  }

  async function resend() {
    setError('');
    try { await authApi.resendOtp(phone); setCooldown(60); }
    catch (e) { setError(e instanceof ApiError ? e.message : 'Could not resend.'); }
  }

  return (
    <div style={{ padding: '28px 22px' }}>
      <Wordmark />
      <h1 style={{ fontSize: '1.6rem', marginTop: 28 }}>Verify your phone</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 22, fontSize: '0.9rem' }}>
        Enter the code we sent to {phone}.
      </p>
      <Banner kind="error">{error}</Banner>
      <Field label="6-digit code">
        <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000" inputMode="numeric"
          style={{ fontFamily: 'var(--mono)', fontSize: '1.4rem', letterSpacing: '0.4em', textAlign: 'center' }} />
      </Field>
      <Button full loading={loading} onClick={submit}>Verify & continue</Button>
      <div style={{ textAlign: 'center', marginTop: 18, fontSize: '0.85rem', color: 'var(--muted)' }}>
        {cooldown > 0
          ? <>Resend code in {cooldown}s</>
          : <button onClick={resend} style={{ color: 'var(--brand)', fontWeight: 600 }}>Resend code</button>}
      </div>
      <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.82rem' }}>
        <Link to="/register" style={{ color: 'var(--muted)' }}>\u2190 Change details</Link>
      </p>
    </div>
  );
}
