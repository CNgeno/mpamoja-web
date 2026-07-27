import { Link } from 'react-router-dom';
import { Wordmark } from '../components/PageHeader';
import { Button } from '../components/ui';

export default function Landing() {
  return (
    <div style={{ padding: '28px 22px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Wordmark />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
        <div>
          <h1 style={{ fontSize: '2.1rem', lineHeight: 1.15 }}>
            Fundraise together,<br />
            <span style={{ color: 'var(--brand)' }}>without the risk.</span>
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: 14, fontSize: '1rem' }}>
            Money goes into a transparent kitty wallet — never a personal number.
            Every contribution and withdrawal is visible to the whole group.
          </p>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {[
            ['Structural safety', 'Funds never touch an organiser\u2019s pocket.'],
            ['Full transparency', 'Everyone sees the running total and every payout.'],
            ['M-PESA native', 'Contribute in seconds with an STK push.'],
          ].map(([t, d]) => (
            <div key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald)', marginTop: 7 }} />
              <div>
                <div style={{ fontWeight: 600 }}>{t}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        <Link to="/register"><Button full>Start a kitty</Button></Link>
        <Link to="/login"><Button full variant="ghost">I already have an account</Button></Link>
      </div>
    </div>
  );
}
