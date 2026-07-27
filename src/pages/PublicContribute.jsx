import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicApi, ApiError } from '../api/client';
import { Wordmark } from '../components/PageHeader';
import { Card, ProgressBar, Button, Field, Banner, Spinner } from '../components/ui';
import { fmtKes, timeAgo } from '../lib/format';

export default function PublicContribute() {
  const { shareToken } = useParams();
  const [kitty, setKitty] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', amountKes: '', anonymous: false });
  const [submitting, setSubmitting] = useState(false);
  const [intent, setIntent] = useState(null);

  const load = () => publicApi.getKitty(shareToken).then(setKitty)
    .catch((e) => setError(e instanceof ApiError ? e.message : 'Kitty not found.'));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [shareToken]);

  async function contribute() {
    setError('');
    if (!form.phone || !form.amountKes) { setError('Enter your phone and an amount.'); return; }
    setSubmitting(true);
    try {
      const res = await publicApi.contribute(shareToken, {
        name: form.anonymous ? 'Anonymous' : form.name,
        phone: form.phone, amountKes: Number(form.amountKes), anonymous: form.anonymous,
      });
      setIntent(res);
      // Poll for confirmation (STK outcome or simulated callback)
      pollStatus(res.intentId);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not start contribution.');
    } finally { setSubmitting(false); }
  }

  function pollStatus(intentId, tries = 0) {
    if (tries > 20) return;
    publicApi.contributionStatus(shareToken, intentId).then((s) => {
      setIntent((prev) => ({ ...prev, ...s }));
      if (s.status === 'Confirmed') { load(); return; }
      if (['Failed', 'Cancelled', 'TimedOut'].includes(s.status)) return;
      setTimeout(() => pollStatus(intentId, tries + 1), 3000);
    }).catch(() => {});
  }

  if (error && !kitty) return <div style={{ padding: 24 }}><Wordmark /><Banner kind="error" >{error}</Banner></div>;
  if (!kitty) return <Spinner label="Loading\u2026" />;

  return (
    <div style={{ padding: '22px 18px' }}>
      <div style={{ marginBottom: 18 }}><Wordmark size={22} /></div>

      <Card style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: '1.35rem', marginBottom: 4 }}>{kitty.name}</h1>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 14 }}>
          {kitty.category} \u00b7 {kitty.status}
        </div>
        {kitty.description && <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: 14 }}>{kitty.description}</p>}
        <ProgressBar raised={kitty.raised} goal={kitty.goal} />
        <div style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--muted)' }}>{kitty.contributorCount} contributor(s)</div>
      </Card>

      {intent?.status === 'Confirmed' ? (
        <Card style={{ textAlign: 'center', padding: 30 }}>
          <div style={{ fontSize: '2.4rem' }}>\ud83c\udf89</div>
          <h3>Asante! Contribution received.</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 6 }}>
            Your contribution is now part of the kitty total. You\u2019ll get an SMS receipt.
          </p>
        </Card>
      ) : intent?.status === 'StkSent' ? (
        <Card style={{ textAlign: 'center', padding: 30 }}>
          <Spinner label="Check your phone for the M-PESA PIN prompt\u2026" />
        </Card>
      ) : (
        <Card>
          <h3 style={{ fontSize: '1rem', marginBottom: 14 }}>Contribute</h3>
          <Banner kind="error">{error}</Banner>
          {intent?.error && <Banner kind="error">{intent.error}</Banner>}
          {!form.anonymous && (
            <Field label="Your name">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Kamau O." />
            </Field>
          )}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: '0.85rem' }}>
            <input type="checkbox" checked={form.anonymous} style={{ width: 'auto' }}
              onChange={(e) => setForm({ ...form, anonymous: e.target.checked })} />
            Contribute anonymously
          </label>
          <Field label="M-PESA phone">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0708 374 149" inputMode="tel" />
          </Field>
          <Field label="Amount (KES)">
            <input value={form.amountKes} onChange={(e) => setForm({ ...form, amountKes: e.target.value.replace(/[^\d]/g, '') })}
              inputMode="numeric" placeholder="500" style={{ fontFamily: 'var(--mono)', fontSize: '1.1rem' }} />
          </Field>
          <Button full variant="money" loading={submitting} onClick={contribute}>
            Contribute {form.amountKes ? fmtKes(Number(form.amountKes)) : ''}
          </Button>
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--muted)', marginTop: 12 }}>
            \ud83d\udd12 Funds go into a transparent kitty wallet, not a personal account.
          </p>
        </Card>
      )}

      {kitty.contributions?.length > 0 && (
        <Card style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Recent contributors</h3>
          <div style={{ display: 'grid', gap: 9 }}>
            {kitty.contributions.slice(0, 10).map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>{c.name} <span style={{ color: 'var(--muted)', fontSize: '0.72rem' }}>{timeAgo(c.at)}</span></span>
                <span className="amount" style={{ color: 'var(--emerald)', fontWeight: 600 }}>{fmtKes(c.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
