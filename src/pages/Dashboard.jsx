import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { kittyApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { Card, ProgressBar, Banner, Spinner, Button } from '../components/ui';
import { fmtKes } from '../lib/format';

export default function Dashboard() {
  const { user } = useAuth();
  const [kitties, setKitties] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    kittyApi.mine()
      .then(setKitties)
      .catch((e) => { setError(e instanceof ApiError ? e.message : 'Could not load kitties.'); setKitties([]); });
  }, []);

  const totalRaised = (kitties || []).reduce((s, k) => s + (k.raised || 0), 0);

  return (
    <>
      <PageHeader title={`Habari${user?.name ? ', ' + user.name.split(' ')[0] : ''}`} subtitle="Your kitties" />
      <div style={{ padding: '0 18px' }}>
        <Banner kind="error">{error}</Banner>

        {kitties && kitties.length > 0 && (
          <Card style={{ background: 'var(--grad)', color: '#fff', marginBottom: 16 }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Total raised across all kitties</div>
            <div className="amount" style={{ fontSize: '2rem', fontWeight: 600, marginTop: 4 }}>{fmtKes(totalRaised)}</div>
          </Card>
        )}

        {!kitties && <Spinner label="Loading your kitties\u2026" />}

        {kitties && kitties.length === 0 && (
          <Card style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: '2.4rem', marginBottom: 8 }}>\ud83e\ude99</div>
            <h3>No kitties yet</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: '6px 0 16px' }}>
              Start one and share the link to your WhatsApp group.
            </p>
            <Link to="/app/new"><Button>Create your first kitty</Button></Link>
          </Card>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          {(kitties || []).map((k) => (
            <Link key={k.id} to={`/app/kitty/${k.id}`}>
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{k.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>
                      {k.category}
                    </div>
                  </div>
                  <StatusPill status={k.status} />
                </div>
                <ProgressBar raised={k.raised} goal={k.goal} />
                <div style={{ marginTop: 10, fontSize: '0.78rem', color: 'var(--muted)' }}>
                  {k.contributorCount} contributor{k.contributorCount === 1 ? '' : 's'}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

function StatusPill({ status }) {
  const map = {
    Active:      { bg: 'var(--bg-tint)', fg: 'var(--brand)' },
    GoalReached: { bg: '#ECFDF5', fg: 'var(--emerald)' },
    Closed:      { bg: '#F5F6FA', fg: 'var(--muted)' },
    Frozen:      { bg: '#FFF5F5', fg: 'var(--danger)' },
  }[status] || { bg: 'var(--bg-tint)', fg: 'var(--brand)' };
  return (
    <span style={{ background: map.bg, color: map.fg, fontSize: '0.68rem', fontWeight: 700,
      padding: '4px 9px', borderRadius: 60, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
      {status}
    </span>
  );
}
