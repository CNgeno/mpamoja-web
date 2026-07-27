import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { kittyApi, withdrawalApi, ApiError } from '../api/client';
import { useKittyProgress } from '../realtime/useKittyProgress';
import { PageHeader } from '../components/PageHeader';
import { Card, ProgressBar, Button, Banner, Spinner } from '../components/ui';
import { fmtKes, timeAgo } from '../lib/format';

export default function KittyDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [kitty, setKitty] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const live = useKittyProgress(id);

  useEffect(() => {
    kittyApi.get(id).then(setKitty).catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load.'));
    withdrawalApi.forKitty(id).then(setWithdrawals).catch(() => {});
  }, [id]);

  if (error) return <div style={{ padding: 20 }}><Banner kind="error">{error}</Banner></div>;
  if (!kitty) return <Spinner label="Loading kitty\u2026" />;

  // Live SignalR values override the initial fetch when present.
  const raised = live?.raised ?? kitty.raised;
  const contributorCount = live?.contributorCount ?? kitty.contributorCount;

  async function share() {
    const url = kitty.shareUrl;
    const text = `Support "${kitty.name}" on M-Pamoja: ${url}`;
    if (navigator.share) { try { await navigator.share({ title: kitty.name, text, url }); return; } catch { /* fall through */ } }
    await navigator.clipboard.writeText(url);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  const waUrl = `https://wa.me/?text=${encodeURIComponent(`Support "${kitty.name}" on M-Pamoja \u2014 contribute securely here: ${kitty.shareUrl}`)}`;

  return (
    <>
      <PageHeader title={kitty.name} subtitle={kitty.category}
        right={<Link to={`/app/kitty/${id}/withdraw`} style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--brand)' }}>Withdraw</Link>} />
      <div style={{ padding: '0 18px', display: 'grid', gap: 14 }}>
        <Card>
          <ProgressBar raised={raised} goal={kitty.goal} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: '0.82rem', color: 'var(--muted)' }}>
            <span>{contributorCount} contributor{contributorCount === 1 ? '' : 's'}</span>
            {live && <span style={{ color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--emerald)' }} />live</span>}
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Button variant="money" onClick={share}>{copied ? 'Link copied!' : 'Share link'}</Button>
          <a href={waUrl} target="_blank" rel="noreferrer"><Button variant="ghost" full>Share to WhatsApp</Button></a>
        </div>

        {kitty.description && <Card><p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{kitty.description}</p></Card>}

        <Card>
          <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>Recent contributions</h3>
          {(!kitty.recentContributions || kitty.recentContributions.length === 0) && (
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No contributions yet. Share the link to get started.</p>
          )}
          <div style={{ display: 'grid', gap: 10 }}>
            {(kitty.recentContributions || []).map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{c.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{timeAgo(c.at)}</div>
                </div>
                <span className="amount" style={{ color: 'var(--emerald)', fontWeight: 600 }}>{fmtKes(c.amount)}</span>
              </div>
            ))}
          </div>
        </Card>

        {withdrawals.length > 0 && (
          <Card>
            <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>Withdrawals</h3>
            <div style={{ display: 'grid', gap: 10 }}>
              {withdrawals.map((w) => (
                <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{w.status}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{timeAgo(w.createdAt)}</div>
                  </div>
                  <span className="amount" style={{ fontWeight: 600 }}>{fmtKes(w.net)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
